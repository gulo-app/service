const path      =   require('path');
const RES_ERROR =   require('./errors/res_error');

let PORT;

process.env.PWD = path.join(__dirname, '../');
switch(process.env.NODE_ENV){
  case 'production':
    process.env.IS_PROD = true;
    PORT = process.env.PORT;
    break;
  case 'montv':
    process.env.IS_MONTV = true;
    PORT = 9399;
    console.log("running on montv production");
    break;
  default:
    PORT = 9001;
}

module.exports = {
  PORT,
  RES_ERROR,    //const Error callback,
  GOOGLE_CID:   '180978526897-8o5c4k9vakqt2eqfbgd2u9ng5jaobl4j.apps.googleusercontent.com'
};

//heroku logs --source app --tail
