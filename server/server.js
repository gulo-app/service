const https       =   require('https');
const http       =   require('http');
const app         =   require('express')();
const {PORT}      =   require('./config');
const appConfig   =   require('./middleware/app-config');
const conn        =   require('./db/connection');
const routes      =   require('./routes');
const fs          =   require('fs');
const socket      =   require('./socket');

const server = async () => {
  appConfig(app);
  app.use('/', routes);

  //create HTTP(dev) || HTTPS(prod) server
  if(process.env.IS_MONTV){  //montv production provide SSL connection
      var ssl_credentials = {key:  fs.readFileSync(`../../nodejs/montv-service/server/security/ssl/montv.pem`, 'utf8'), cert: fs.readFileSync(`../../nodejs/montv-service/server/security/ssl/montv.cer`, 'utf8')};

      const httpsServer = https.createServer(ssl_credentials, app);
      await socket(httpsServer, app);
      httpsServer.listen(PORT, () => {
       console.log(`listening on https:${PORT}`);
      });

  } else {
      const httpServer = http.createServer(app);
      await socket(httpServer, app);
      httpServer.listen(PORT, async () => {
        console.log(`listening on http: ${PORT}`);
      });
  }
}

module.exports = server;
