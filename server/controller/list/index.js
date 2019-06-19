const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {verifyDevice, isDeviceConnected}    =   require('../device');
const {getList, getListShares, getListCreator, getListDevice}       =   require('./list_id')
const {getListProducts}           =   require('./list_id/product');
const {getListManualProducts}     =   require('./list_id/manual_product');
const socketEmitter               =   require('../socket/emitter');
const ctrlNotify                  =   require('../notification');

const addList = async (creator, newList, io) => { //create new list {list_name, list_type, device_id, device_password, shares: []}
    if(Object.keys(newList).length!==5 || !newList.list_name || !newList.list_type)
      throw new ParamsError('title param is missing'); //check if params are missings

    let device = {id: newList.device_id, password: newList.device_password};
    if(device.id && await verifyDevice(device)===false)
      throw new ParamsError("device details invalid");
    if(device.id && await isDeviceConnected(device.id))
      throw new ParamsError("device already connected");

    //start insert into DB:
    let cb = await conn.sql(`INSERT INTO lists
                              (user_id, list_name, list_type_id, device_id, modified_at)
                            VALUES
                              (${creator.user_id},'${newList.list_name}', ${newList.list_type}, ${device.id || null}, NOW())`);
    let newListID = cb.insertId;

    if(newList.shares && newList.shares.length>0){ //insert shares(if exists) into list_shares table
      for(let share of newList.shares){
        let user = await conn.sql(`SELECT user_id FROM users WHERE user_id=${share.user_id}`);
        if(user.length>0)
          await ctrlNotify.shareListRequest(io, share.user_id, creator.user_id, newListID);
      }
    }

    let newListCB = await getList(newListID);
    await socketEmitter.emitByUser(io, creator.user_id, 'newList' , newListCB);
    return newListCB;
}

// get all lists that the user shares
const getAllLists = async (user) => {
  let listsCB = [];
  let lists = await conn.sql(`
               SELECT lists.list_id
               FROM lists
               WHERE lists.list_id IN
                   (   SELECT list_id FROM lists WHERE user_id=${user.user_id}
                        UNION
                       SELECT list_id FROM list_shares WHERE user_id=${user.user_id}
                    )
               GROUP BY list_id
              `);
  for(let list of lists)
    listsCB.push(await getList(list.list_id));

  return listsCB;
}

const getTypes = async () => {
  return await conn.sql(`SELECT list_type_id as id, list_type_name as name, list_type_color as color FROM list_types lt`);
}

module.exports = {
  addList,
  getAllLists,
  getTypes,
}
