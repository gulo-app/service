const conn                        =   require('../../../db/connection');
const {ParamsError, AuthError}    =   require('../../../config/errors');
const {getListProducts}           =   require('./product');

const getList = async (list_id) => {
  let list = await conn.sql(`
          SELECT lists.*, COUNT(lp.barcode) as total_products, lt.*, users.mail as creator_mail
          FROM lists
          LEFT JOIN list_products lp ON lp.list_id=lists.list_id
          NATURAL JOIN list_types lt
          NATURAL JOIN users
          WHERE lists.list_id=${list_id}
          GROUP BY lists.list_id
  `);

  if(list.length===0)
    return null;
  list[0].products  =   await getListProducts(list_id);
  return list[0];
}

const insertProduct = async (list_id, barcode, quantity) => {
  if(!quantity) quantity=1;
  try{
    let cb = await conn.sql(`
      INSERT INTO list_products (list_id,  barcode, quantity) VALUES (${list_id}, ${barcode}, ${quantity})
      ON DUPLICATE KEY UPDATE quantity = quantity+${quantity}
    `);
    return cb.insertId;
  }catch(e){
    console.log(e.message);
    return false;
  }
}

module.exports = {
  getList,
  insertProduct
}
