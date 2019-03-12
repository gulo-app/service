const createDB        =   require('./create');
const fillDB          =   require('./fill');
const {ParamsError}   =   require('../../../config/errors');

//initialize DB
module.exports = async (pass, isFill) => {
  if(pass!=='guloAdmin')
    throw new ParamsError('pass is wrong!');

  await createDB();
  if(isFill==='true' || isFill===true){
    await fillDB.products();
  }

  return true;
}
