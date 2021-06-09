const https       =   require('https');
const http        =   require('http');
const express     =   require('express');
const app         =   express();
const {PORT}      =   require('./config');
const fs          =   require('fs');
const path        =   require('path');

const client = async () => {
  let buildPath = path.join(__dirname, '../client/_public/build');
  app.use('/', express.static(buildPath)) //serve react manager client
  app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, '/index.html'));
  })
  const currYear = (new Date()).getFullYear();

  if(process.env.IS_MONTV){  //montv production provide SSL connection
      var ssl_credentials = {key:  fs.readFileSync(`../../nodejs/node-service/server/security/ssl/${currYear}/montv.pem`, 'utf8'), cert: fs.readFileSync(`../../nodejs/node-service/server/security/ssl/${currYear}/montv.cer`, 'utf8')};

      const httpsServer = https.createServer(ssl_credentials, app);
      httpsServer.listen(PORT, () => {
       console.log(`CLIENT listening on https:${PORT}`);
      });

  } else {
      const httpServer = http.createServer(app);
      httpServer.listen(PORT, async () => {
        console.log(`CLIENT listening on http: ${PORT}`);
      });
  }
};

module.exports = client;
