const conn            =   require('../../db/connection');
const {ParamsError}   =   require('../../config/errors');

const addList = async (newList) => {
    if(!newList.title || !newList.user_id)
      throw new ParamsError('title || user_id params are missing'); //check if params are missings

    let user = await conn.sql(`SELECT * FROM users WHERE user_id=${newList.user_id}`); //check if user_id is legal
    if(user.length===0)
      throw new ParamsError('user_id not exists');

    if(newList.shares && newList.shares.length>0){ //validate if shares[] are legal user_ids
      for(let share_id of newList.shares){
        let user = await conn.sql(`SELECT * FROM users WHERE user_id=${share_id}`);
        if(user.length===0)
          throw new ParamsError(`share_id: ${share_id} user not exists`);
      }
    }

    //start insert into DB:
    let cb = await conn.sql(`INSERT INTO lists (user_id, list_name) VALUES (${newList.user_id},'${newList.title}')`);
    let newListID = cb.insertId;

    if(newList.shares && newList.shares.length>0){ //insert shares(if exists) into list_shares table
      for(let share_id of newList.shares){
        await conn.sql(`INSERT INTO list_shares (list_id, user_id) VALUES (${newListID},${share_id})`);
      }
    }

    return {list_id: newListID, list_name: newList.title, user_id: newList.user_id, shares: newList.shares};
}

module.exports = {
  addList
}
