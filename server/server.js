const app         =   require('express')();
const {PORT}      =   require('./config');
const appConfig   =   require('./middleware/app-config');
const conn        =   require('./db/connection');
const routes      =   require('./routes');

const server = async () => {
  appConfig(app);
  app.use('/', routes);

  app.listen(PORT, async () => {
    console.log(`service running on: ${PORT}`);
  });
}

module.exports = server;
