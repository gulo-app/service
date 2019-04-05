const conn = require('../../db/connection');


const emitByList = async (io, list_id, eventName, payload) => {
  let list_users = await conn.sql(`
    SELECT user_id
    FROM lists WHERE list_id=${list_id}
      UNION
    SELECT user_id
    FROM list_shares WHERE list_id=${list_id}
  `);
  for(let user of list_users)
    io.sockets.in(`user/${user.user_id}`).emit(eventName, payload);

  return true;
}

const emitByUser = async (io, user_id, eventName, payload) => {
  io.sockets.in(`user/${user_id}`).emit(eventName, payload);
  return true;
}


module.exports = {
  emitByList,
  emitByUser
}
