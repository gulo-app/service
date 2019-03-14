const path      =   require('path');
const RES_ERROR =   require('./errors/res_error');

process.env.PWD = path.join(__dirname, '../');
if(process.env.NODE_ENV==='PROD')
  process.env.IS_PROD = true;

module.exports = {
  PORT:         process.env.PORT || 9001,
  RES_ERROR,    //const Error callback,
  GOOGLE_CID:   '180978526897-8o5c4k9vakqt2eqfbgd2u9ng5jaobl4j.apps.googleusercontent.com'
};
