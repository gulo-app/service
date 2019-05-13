const path      =   require('path');
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
PORT = process.env.PORT || 9500;

module.exports = {
  PORT  
};

//heroku logs --source app --tail
