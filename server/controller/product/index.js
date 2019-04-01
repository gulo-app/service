const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');

const getProduct = async (barcode) => {
  let product = await conn.sql(`SELECT * FROM products WHERE barcode=${barcode}`);
  if(product.length===0)
    return null;
  return product[0];
}

module.exports = {
  getProduct
}
