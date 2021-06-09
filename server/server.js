const https       =   require('https');
const http       =   require('http');
const app         =   require('express')();
const {PORT}      =   require('./config');
const appConfig   =   require('./middleware/app-config');
const conn        =   require('./db/connection');
const routes      =   require('./routes');
const fs          =   require('fs');
const socket      =   require('./socket');
const firebase    =   require('./firebase');

const server = async () => {
  appConfig(app);
  app.use('/', routes);
  const currYear = (new Date()).getFullYear();
  //create HTTP(dev) || HTTPS(prod) server
  if(process.env.IS_MONTV){  //montv production provide SSL connection
      var ssl_credentials = {key:  fs.readFileSync(`../../nodejs/node-service/server/security/ssl/${currYear}/montv.pem`, 'utf8'), cert: fs.readFileSync(`../../nodejs/node-service/server/security/ssl/${currYear}/montv.cer`, 'utf8')};      
      const httpsServer = https.createServer(ssl_credentials, app);
      await socket(httpsServer, app);
      httpsServer.listen(PORT, () => {
       console.log(`SERVICE listening on https:${PORT}`);
      });

  } else {
      const httpServer = http.createServer(app);
      await socket(httpServer, app);
      httpServer.listen(PORT, async () => {
        console.log(`SERVICE listening on http: ${PORT}`);
      });
  }
}

module.exports = server;
