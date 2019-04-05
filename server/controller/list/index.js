const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {verifyDevice, isDeviceConnected}    =   require('../device');
const {getList, getListShares, getListCreator, getListDevice}       =   require('./list_id')
const {getListProducts}           =   require('./list_id/product');
const socketEmitter               =   require('../socket/emitter');

const addList = async (creator, newList, io) => { //create new list {list_name, list_type, device_id, device_password, shares: []}
    if(Object.keys(newList).length!==5 || !newList.list_name || !newList.list_type)
      throw new ParamsError('title param is missing'); //check if params are missings

    let device = {id: newList.device_id, password: newList.device_password};
    if(device.id && await verifyDevice(device)===false)
      throw new ParamsError("device details invalid");
    if(device.id && await isDeviceConnected(device.id))
      throw new ParamsError("device already connected");

    //start insert into DB:
    let cb = await conn.sql(`INSERT INTO lists (user_id, list_name, list_type_id, device_id) VALUES (${creator.user_id},'${newList.list_name}', ${newList.list_type}, ${device.id || null})`);
    let newListID = cb.insertId;
    let newListCB = await getList(newListID);

    if(newList.shares && newList.shares.length>0){ //insert shares(if exists) into list_shares table
      for(let share of newList.shares){
        let user = await conn.sql(`SELECT user_id FROM users WHERE user_id=${share.user_id}`);
        if(user.length>0){
          await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${newListID},${share.user_id})`);
        }
      }
    }

    await socketEmitter.emitByList(io, newListCB.list_id, 'newList' , newListCB);
    return newListCB;
}

// get all lists that the user shares
const getAllLists = async (user) => {
  let lists = await conn.sql(`
               SELECT lists.list_id, lists.list_name, lt.*,
                      COUNT(lp.barcode) as total_products
               FROM lists
               LEFT JOIN list_products lp ON lp.list_id=lists.list_id
               LEFT JOIN list_types lt ON lt.list_type_id=lists.list_type_id
               WHERE lists.list_id IN
                   (   SELECT list_id FROM lists WHERE user_id=${user.user_id}
                        UNION
                       SELECT list_id FROM list_shares WHERE user_id=${user.user_id}
                    )
               GROUP BY list_id
              `);
  for(let list of lists){
    list.products = await getListProducts(list.list_id);
    list.shares   = await getListShares(list.list_id);
    list.creator  = await getListCreator(list.list_id);
    list.device   = await getListDevice(list.list_id) || {};
  }

  return lists;
}

const getTypes = async () => {
  return await conn.sql(`SELECT list_type_id as id, list_type_name as name, list_type_color as color FROM list_types lt`);
}

module.exports = {
  addList,
  getAllLists,
  getTypes,
}
