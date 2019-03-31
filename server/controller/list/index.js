const conn            =   require('../../db/connection');
const {ParamsError, AuthError}   =   require('../../config/errors');

const addList = async (creator, newList) => {
    if(!newList.title)
      throw new ParamsError('title param is missing'); //check if params are missings

    //validate if shares[] are legal user_ids
    if(newList.shares && newList.shares.length>0){
      for(let share_id of newList.shares){
        let user = await conn.sql(`SELECT * FROM users WHERE user_id=${share_id}`);
        if(user.length===0)
          throw new ParamsError(`share_id: ${share_id} user not exists`);
      }
    }

    //start insert into DB:
    let cb = await conn.sql(`INSERT INTO lists (user_id, list_name) VALUES (${creator.user_id},'${newList.title}')`);
    let newListID = cb.insertId;

    if(newList.shares && newList.shares.length>0){ //insert shares(if exists) into list_shares table
      for(let share_id of newList.shares){
        await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${newListID},${share_id})`);
      }
    }

    return {list_id: newListID, list_name: newList.title, user_id: creator.user_id, shares: newList.shares};
}


// get all lists that the user shares
const getAllLists = async (user) => {
  let lists = await conn.sql(`SELECT list_name, list_id FROM lists
                            WHERE list_id IN
                            (SELECT list_id FROM lists WHERE user_id=${user.user_id}
                            UNION
                            SELECT list_id FROM list_shares WHERE user_id=${user.user_id})`);

  if(lists.length===0)
    return false;

  return lists;
}


const updateList = async (user_id, list_id, title) => {
  console.log(user_id);
  console.log(list_id);
  console.log(title);
  if(!list_id || !title)
    throw new ParamsError('one of the param is missing or incorect');

  let listBelongsUser = await isListBelongsToUser(user_id,list_id);  
  if(!listBelongsUser)
    throw new AuthError(`user_id: ${user_id} has no permission to change list_id: ${list_id}`);

  let cb = await conn.sql(`UPDATE lists
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
      console.log(`failed to share list: ${list_id} to user: ${share_id}`);
    }
  }
  return {sharedUsers};
}


const getListProducts = async (user_id, list_id) => {
  if(!isListBelongsToUser(user_id, list_id))
    throw new AuthError(`user_id: ${user_id} has no permission to change list_id: ${list_id}`);
  
  let products = await conn.sql(`SELECT * FROM list_products WHERE list_id=${list_id}`);

  if(products.length===0)
    return false;

  return products;
}


/**
 * validate user's permission to list
 * @returns false - if list is not belong to the user
 *          true - list belong to user
 */
const isListBelongsToUser = async (user_id, list_id) => {
  let listBelongToUser =  await conn.sql(`SELECT *
                                          FROM lists
                                          WHERE list_id IN
                                          (SELECT list_id FROM lists WHERE user_id=${user_id} AND list_id=${list_id}
                                          UNION
                                          SELECT list_id FROM list_shares WHERE user_id=${user_id} AND list_id=${list_id})
                                        `);

  if(listBelongToUser.length===0) 
    return false;
  
  return true;  
}

module.exports = {
  addList,
  getAllLists,
  updateList,
  deleteList,
  shareList,
  getListProducts,
  isListBelongsToUser
}
