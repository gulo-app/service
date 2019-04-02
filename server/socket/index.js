const serverIO    =   require('socket.io');

module.exports = (server) => {
  const io = serverIO(server);
  io.on('connection', socket => {
    console.log(`${socket.id} connected`)

    socket.on('disconnect', (socket) => {
      console.log(`${socket.id} disconnected`)
    });
  });
}
