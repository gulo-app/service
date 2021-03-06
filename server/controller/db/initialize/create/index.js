const createDatabase          =   require('./database');
const createUsers             =   require('./users');
const createProducts          =   require('./products');
const createLists             =   require('./lists');
const createNotifications     =   require('./notifications');
const createShoppingCarts     =   require('./best_shopping_cart');
const createDevices           =   require('./devices');

module.exports = async () => {
  await createDatabase();
  await createDevices();
  await createUsers();
  await createProducts();
  await createLists();
  await createNotifications();
  await createShoppingCarts();
  console.log("*** DB was initialized ***");
}
