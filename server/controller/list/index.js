const conn            =   require('../../db/connection');
const {ParamsError}   =   require('../../config/errors');

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
  let cb = await conn.sql( `SELECT list_name, list_id FROM lists
                            WHERE list_id IN 
                            (SELECT list_id FROM lists WHERE user_id=${user.user_id}
                            UNION
                            SELECT list_id FROM list_shares WHERE user_id=${user.user_id})`);
  
  if(cb.length===0){
    return 0;
  }

  return {listId: cb.list_id, listName: cb.list_name};
}

const updateList = async (listId,title) => {
  if(!listId || !title)
    throw new ParamsError('one of the param is missing or incorect');
  
  let cb = await conn.sql( `UPDATE lists 
                            SET list_name=${title} 
                            WHERE list_id=${listId} 
                            RETURNING lists.list_name,lists.list_id`);
  
  return {list_id: cb.list_id, title: cb.list_name}; 
}

const deleteList = async (userId,listId) => {
  let cb = await conn.sql( `DELETE FROM lists 
                            WHERE list_id=${listId} AND user_id=${userId}`);
                                            
  return;                        
}

const shareList = async (listId, user) => {
  let user_id = await conn.sql(`SELECT user_id FROM users WHERE mail=${user}`);

  if(user_id.length===0)
      throw new ParamsError(`user id: ${user_id} not exists`);
  
  let cb = await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${listId},${user_id})`);
  
  return {list_id: cb.list_id, user_id: user_id};
} 


module.exports = {
  addList,
  getAllLists,
  updateList,
  deleteList,
  shareList
}
