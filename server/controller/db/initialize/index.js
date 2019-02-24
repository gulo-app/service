const createDatabase  = require('./create/database');
const createProducts  = require('./create/products');
const createUsers     = require('./create/users');

const createDB = async () => {
  try{    
    await createDatabase();
    await createProducts();
    return 'ok';
  }catch(e){
    throw Error(e);
  }
}

module.exports = {
  createDB
}
