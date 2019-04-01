const conn            =   require('../../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../../config/errors');

const getListProduct = async (list_id, product_id) => {
  let product = await conn.sql(`SELECT * FROM list_products WHERE list_id=${list_id} AND id=${product_id}`);
  if(product.length===0)
    return null;
  return product[0];
}

const toggleCheck = async (list_id, product_id) => {
  let cb = await conn.sql(`UPDATE list_products SET isChecked = IF(isChecked=1, 0, 1) WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('toggleCheck failed');
  return true;
}
module.exports = {
  getListProduct,
  toggleCheck
}
