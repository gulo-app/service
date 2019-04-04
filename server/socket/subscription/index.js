const conn    =    require('../../db/connection');

const on = async (socket) =>{
  await conn.sql(`INSERT INTO user_sockets (user_id, socket_id) VALUES (${socket.user.user_id},'${socket.id}')`);
  socket.join(`user/${socket.user.user_id}`);
  console.log(`subscribe user<${socket.user.user_id}>`);
}

const off = async (socket) =>{
  await conn.sql(`DELETE FROM user_sockets WHERE user_id=${socket.user.user_id} AND socket_id='${socket.id}'`);
  socket.leave(`user/${socket.user.user_id}`);
  console.log(`unsubscribe user<${socket.user.user_id}>`);
}

const init = async () =>{
  await conn.sql(`DELETE FROM user_sockets WHERE user_id>0`); //delete all cahce sockets every time server is up
  console.log(`socket subsciptions initialized`);
}

module.exports = {on, off, init};
