const createDB        =   require('./create');
const fillDB          =   require('./fill');
const {ParamsError}   =   require('../../../config/errors');

//initialize DB
const initializeDB = async (pass, isFill) => {
  if(pass!=='guloAdmin')
    throw new ParamsError('pass is wrong!');

  await createDB();

  if(isFill==='true' || isFill===true)
    fillDB.products();
  

  return true;
}

module.exports = initializeDB;
