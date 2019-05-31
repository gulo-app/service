const path      =   require('path');
const RES_ERROR =   require('./errors/res_error');

let PORT;

process.env.PWD = path.join(__dirname, '../');
switch(process.env.NODE_ENV){
  case 'production':
    process.env.IS_PROD = true;
    break;
  case 'montv':
    process.env.IS_MONTV = true;
    break;
}
PORT = process.env.PORT || 9400;

module.exports = {
  PORT,
  RES_ERROR,    //const Error callback,
  GOOGLE_CID:   '180978526897-8o5c4k9vakqt2eqfbgd2u9ng5jaobl4j.apps.googleusercontent.com',
  VERIFIED_COUNTER: 3   //number of times a new product needs to be confirmed to officially enter inventory
};

//heroku logs --source app --tail
