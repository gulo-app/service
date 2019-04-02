const app         =   require('express')();
const {PORT}      =   require('./config');
const appConfig   =   require('./middleware/app-config');
const conn        =   require('./db/connection');
const routes      =   require('./routes');
const fs          =   require('fs');
const https = require('https');

const server = async () => {
  appConfig(app);
  app.use('/', routes);

  app.listen(PORT, async () => {
    console.log(`service running on: ${PORT}`);
  });

  if(process.env.IS_MONTV){  //montv production provide SSL connection
      var ssl_credentials = {
        key:  fs.readFileSync(`../../nodejs/montv-service/server/security/ssl/montv.pem`, 'utf8'),
        cert: fs.readFileSync(`../../nodejs/montv-service/server/security/ssl/montv.cer`, 'utf8')
      };

      let SSL_PORT = PORT+1;
      var httpsServer = https.createServer(ssl_credentials, app);
      httpsServer.listen(SSL_PORT, () => {
       console.log(`listenting SSL on ${SSL_PORT}`);
      });
  }
}

module.exports = server;
