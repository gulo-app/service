const _                           =   require('lodash');
const conn                        =   require('../../../db/connection');
const {ParamsError, AuthError}    =   require('../../../config/errors');
const {getListProducts}           =   require('./product');
const {getListProduct}            =   require('./product/product_id');
const {getListManualProducts}     =   require('./manual_product');
const socketEmitter               =   require('../../socket/emitter');
const ctrlNotify                  =   require('../../notification');

const getList = async (list_id) => {
  let list = await conn.sql(`
               SELECT lists.list_id, lists.list_name, lt.*,
                      COUNT(lp.barcode) as total_products
               FROM lists
               LEFT JOIN list_products lp ON lp.list_id=lists.list_id
               LEFT JOIN list_types lt ON lt.list_type_id=lists.list_type_id
               WHERE lists.list_id=${list_id}
              `);
  if(list.length===0)
    return null;

  list = list[0];
  list.shares           =   await getListShares(list.list_id);
  list.creator          =   await getListCreator(list.list_id);
  list.device           =   await getListDevice(list.list_id) || {};
  list.products         =   await getListProducts(list.list_id);
  list.manual_products  =   await getListManualProducts(list.list_id);

  return list;
}

const deleteList = async (user, list, io) => {
  if(user.mail===list.creator.mail){ //user is the creator. delete entire list!
    await socketEmitter.emitByList(io, list.list_id, 'listDeleted' , list.list_id);
    await conn.sql(`DELETE FROM lists WHERE list_id=${list.list_id} AND user_id=${user.user_id}`);
    await conn.sql(`DELETE FROM notifications WHERE notification_type_id=1 AND subject_id=${list.list_id}`); //remove all notifications about this specific list
  } else { //user only removes himself from list_shares
    await conn.sql(`DELETE FROM list_shares WHERE list_id=${list.list_id} AND user_id=${user.user_id}`);
    await conn.sql(`DELETE FROM notifications WHERE notification_type_id=1 AND subject_id=${list.list_id} AND notifier_id=${user.user_id}`); //remove all notifications about this specific list
    await ctrlNotify.leaveList(io, list.creator.user_id, user.user_id, list.list_id);
    await socketEmitter.emitByUser(io, user.user_id, 'listDeleted' , list.list_id);
  }

  list = await getList(list.list_id); //null or list with 1 less share
  if(list)
    await socketEmitter.emitByList(io, list.list_id, 'listUpdated' , list);
  return list;
}

const updateList = async (list, user, io) => {
  if(!list.list_name || !list.creator || !list.list_type)
    throw new ParamsError('one of the param is missing or incorect');

  if(!list.isCreator)
    throw new AuthError(`user_id: ${user.user_id} has no permission to change list_id: ${list.list_id}`);

  let device = {id: list.device_id, password: list.device_password};
  if(device.id && await require('../../device').verifyDevice(device)===false)
    throw new ParamsError("device details invalid");

  for(delShare of list.shares_deleted){
    await conn.sql(`DELETE FROM list_shares   WHERE user_id=${delShare.user_id} AND list_id=${list.list_id}`);
    await ctrlNotify.removedFromList(io, delShare.user_id, user.user_id, list.list_id);
    await socketEmitter.emitByUser(io, delShare.user_id, 'listDeleted' , list.list_id);
  }
  for(newShare of list.shares_inserted)
    await ctrlNotify.shareListRequest(io, newShare.user_id, user.user_id, list.list_id);


  let cb = await conn.sql(`UPDATE lists SET list_name='${list.list_name}', list_type_id=${list.list_type}, device_id=${device.id || null}
                           WHERE list_id=${list.list_id}`);

  if(cb.affectedRows===0)
    throw new ParamsError('error. update failed');

  let updatedListCB = await getList(list.list_id);
  await socketEmitter.emitByList(io, updatedListCB.list_id, 'listUpdated' , updatedListCB);

  return updatedListCB;
}

const clearList = async (user, list, io) => {
  if(user.mail!==list.creator.mail) //user is NOT the creator. BLOCK ACCESS
    throw new AuthError('unauthorized access. clearList failed!');

  await conn.sql(`DELETE FROM list_products WHERE list_id=${list.list_id}`);
  await conn.sql(`DELETE FROM list_manual_products WHERE list_id=${list.list_id}`);

  list = await getList(list.list_id); //null or list with 1 less share
  if(list)
    await socketEmitter.emitByList(io, list.list_id, 'listUpdated' , list);
  return list;
}

const insertProductToList = async (io, list_id, barcode, quantity) => {
  if(!quantity) quantity=1;
  try{
    let cb = await conn.sql(`
      INSERT INTO list_products (list_id,  barcode, quantity) VALUES (${list_id}, ${barcode}, ${quantity})
      ON DUPLICATE KEY UPDATE quantity = quantity+${quantity}
    `);

    let list_product = await getListProduct(list_id, cb.insertId);
    await socketEmitter.emitByList(io, list_id, 'updateListProduct' , list_product);

    return list_product;
  }catch(e){
    console.log(e.message);
    return false;
  }
}

const getListShares = async (list_id) => {
  let sql = `
    SELECT users.user_id, mail, CONCAT(firstname, ' ', lastname) AS fullname, pic
    FROM list_shares
    NATURAL JOIN users
    WHERE list_id=${list_id}
  `;
  return await conn.sql(sql);
}

const getListCreator = async (list_id) => {
  let creator = await conn.sql(`
                  SELECT users.user_id, mail, CONCAT(firstname, ' ', lastname) AS fullname, pic
                  FROM lists
                  NATURAL JOIN users
                  WHERE list_id=${list_id}
                `);
  if(creator.length===0)
    return null
  return creator[0];
}

const getListDevice = async (list_id) => {
  let device = await conn.sql(`
                SELECT devices.device_id as id, devices.password
                FROM lists
                NATURAL JOIN devices
                WHERE list_id=${list_id}
              `);
  if(device.length===0)
    return null;
  return device[0];
}

const forEachUserInList = async (list_id, func) => {
  let theList = await getList(list_id);
  for(let share of theList.shares)
    await func(share.user_id);

  await func(theList.creator.user_id);
}

const getBestShoppingCart = async (list_id) => {
  let firms     =   await conn.sql(`SELECT * FROM shopping_cart_firms`);
  let products  =   await conn.sql(`
              SELECT *
              FROM list_products lp
              NATURAL JOIN products
              NATURAL JOIN shopping_cart_prices prices
              WHERE lp.list_id=1
          `);
  let firm_products = _.groupBy(products, 'shopping_cart_firm_id');
  for(let firm of firms){
    firm.products       =   firm_products[firm.shopping_cart_firm_id];
    firm.total_price   =   _.round(_.sumBy(firm.products, 'price'),2);
    for(let p of firm.products)
      p.price = _.round(p.price, 2);
  }

  return firms;
}

module.exports = {
  getList,
  updateList,
  deleteList,
  insertProductToList,
  clearList,
  getListShares,
  getListCreator,
  getListDevice,
  forEachUserInList,
  getBestShoppingCart
}
