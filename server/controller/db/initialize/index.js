const createDB    =   require('./create');

module.exports = async () => {
  try{
    await createDB();    
  }catch(e){
    throw Error(e);
  }
}
