const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {verifyDevice, isDeviceConnected}              =   require('../device');
const {getList}                   =   require('./list_id')
const {getListProducts}           =   require('./list_id/product');

const addList = async (creator, newList) => { //create new list {list_name, list_type, device_id, device_password, shares: []}
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

    if(newList.shares && newList.shares.length>0){ //insert shares(if exists) into list_shares table
      for(let share of newList.shares){
        let user = await conn.sql(`SELECT user_id FROM users WHERE user_id=${share.user_id}`);
        if(user.length>0)
          await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${newListID},${share.user_id})`);
      }
    }

    return await getList(newListID);
}

// get all lists that the user shares
const getAllLists = async (user) => {
  let lists = await conn.sql(`
                SELECT lists.*, COUNT(lp.barcode) as total_products, lt.*, users.mail as creator_mail
                FROM (
                        SELECT list_name, list_id, list_type_id, user_id, device_id FROM lists
                        WHERE list_id IN
                        (SELECT list_id FROM lists WHERE user_id=${user.user_id}
                        UNION
                        SELECT list_id FROM list_shares WHERE user_id=${user.user_id})
                ) lists
                LEFT JOIN list_products lp ON lp.list_id=lists.list_id
                LEFT JOIN list_types lt ON lt.list_type_id=lists.list_type_id
                NATURAL JOIN users
                GROUP BY list_id
              `);
  for(let list of lists)
    list.products = await getListProducts(list.list_id);

  return lists;
}

const updateList = async (user_id, list_id, title) => {
  if(!list_id || !title)
    throw new ParamsError('one of the param is missing or incorect');

  let isListBelongsToUser =  await conn.sql(`SELECT *
                                                FROM lists
                                                WHERE list_id IN
                                                (SELECT list_id FROM lists WHERE user_id=${user_id} AND list_id=${list_id}
                                                UNION
                                                SELECT list_id FROM list_shares WHERE user_id=${user_id} AND list_id=${list_id})
                                            `);
  if(isListBelongsToUser.length===0)
    throw new AuthError(`user_id: ${user_id} has no permission to change list_id: ${list_id}`);

  let cb = await conn.sql( `UPDATE lists
                            SET list_name='${title}'
                            WHERE list_id=${list_id}
                          `);

  if(cb.affectedRows===0)
    throw new ParamsError('error. rename failed');

  return;
}

const deleteList = async (user_id, list_id) => {
  let cb1 = await conn.sql(`DELETE FROM lists WHERE list_id=${list_id} AND user_id=${user_id}`);
  let cb2 = await conn.sql(`DELETE FROM list_shares WHERE list_id=${list_id} AND user_id=${user_id}`);

  if(cb1.affectedRows===0 && cb2.affectedRows===0)
    throw new AuthError(`permission denied`);
  return;
}

const shareList = async (user_id, list_id, shares) => {
  if(!user_id || !list_id || !shares || shares.length===0)
      throw new ParamsError(`user_id || list_id || shares params are missing`);

  let isUserOwnList = await conn.sql(`SELECT list_id FROM lists WHERE user_id=${user_id} AND list_id=${list_id}`);
  if(isUserOwnList.length===0)
    throw new AuthError(`permission denied`);

  let sharedUsers = [];
  for(let share_id of shares){
    try{
      await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${list_id}, ${share_id})`);
      sharedUsers.push(share_id);
    }catch(e){
      console.log(`failed to share list<${list_id}> to user<${share_id}>`);
    }
  }
  return {sharedUsers};
}

const getTypes = async () => {
  return await conn.sql(`SELECT list_type_id as id, list_type_name as name, list_type_color as color FROM list_types lt`);
}

module.exports = {
  addList,
  getAllLists,
  updateList,
  deleteList,
  shareList,
  getTypes
}
