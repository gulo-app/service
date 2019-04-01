const conn            =   require('../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../config/errors');

const getListProducts = async (list_id) => {
  let products = await conn.sql(`
    SELECT *
    FROM list_products lp
    NATURAL JOIN products
    NATURAL JOIN brands
    NATURAL JOIN capacity_units
    WHERE lp.list_id=list_id
  `);

  return products;
}

module.exports = {
  getListProducts
}
