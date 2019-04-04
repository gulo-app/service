const conn    =    require('../../db/connection');

const on = async (socket) =>{
  socket.join(`user/${socket.user.user_id}`);
  console.log(`subscribe user<${socket.user.user_id}>`);
}

const off = async (socket) =>{
  socket.leave(`user/${socket.user.user_id}`);
  console.log(`unsubscribe user<${socket.user.user_id}>`);
}

module.exports = {on, off};
