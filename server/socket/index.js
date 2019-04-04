const serverIO    =   require('socket.io');
const subsciption =   require('./subscription');

module.exports = async (server, app) => {
  const io = serverIO(server);
  app.set('io', io);
  await subsciption.init();
  await io.on('connection', socket => {
    app.set('socket', socket);
    socket.on('subscribe', async (user) => {
      if(!user) return false;
      socket.user = user;
      await subsciption.on(socket);
    });

    socket.on('disconnect', async () => {
      if(!socket.user) return false;
      await subsciption.off(socket);
    });
  });
  return io;
}
