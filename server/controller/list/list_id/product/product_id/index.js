const conn            =   require('../../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../../config/errors');

const getListProduct = async (list_id, product_id) => {  
  let product = await conn.sql(`
    SELECT *
    FROM list_products lp
    NATURAL JOIN products
    NATURAL JOIN brands
    NATURAL JOIN capacity_units
    NATURAL JOIN product_category pc
    NATURAL JOIN categories
    WHERE lp.id=${product_id} AND lp.list_id=${list_id}
    GROUP BY barcode
  `);
  if(product.length===0)
    return null;
  return product[0];
}

const toggleCheck = async (list_id, product_id) => {
  let cb = await conn.sql(`UPDATE list_products SET isChecked = IF(isChecked=1, 0, 1) WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('toggleCheck failed');
  return await getListProduct(list_id, product_id);
}
module.exports = {
  getListProduct,
  toggleCheck
}
