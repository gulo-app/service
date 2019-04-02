const conn            =   require('../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../config/errors');

const getListProducts = async (list_id) => {
  let products = await conn.sql(`
    SELECT *
    FROM list_products lp
    NATURAL JOIN products
    NATURAL JOIN brands
    NATURAL JOIN capacity_units
    NATURAL JOIN product_category pc
    NATURAL JOIN categories
    WHERE lp.list_id=${list_id}
    GROUP BY barcode
  `);

  return products;
}

module.exports = {
  getListProducts
}
