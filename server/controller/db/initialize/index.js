const createDatabase  =   require('./create/database');
const createUsers     =   require('./create/users');
const createProducts  =   require('./create/products');
const createLists     =   require('./create/lists');

const createDB = async () => {
  try{
    await createDatabase();
    await createUsers();
    await createProducts();
    await createLists();
    
    return 'Gulo database created successfully';
  }catch(e){
    throw Error(e);
  }
}

module.exports = {
  createDB
}
