const app         =   require('express')();
const {PORT}      =   require('./config');
const appConfig   =   require('./middleware/app-config');
const conn        =   require('./db/connection');
const routes      =   require('./routes');

const server = async () => {
  appConfig(app);
  app.use('/', routes);

  app.get('/', (req, res) => {
      res.send("this is index baby");
  });

  app.listen(PORT, async () => {
    console.log(`service running on: ${PORT}`);
  });
}

module.exports = server;
