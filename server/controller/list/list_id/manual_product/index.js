const conn            =   require('../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../config/errors');
const {getListManualProduct}     =   require('./product_id');
const socketEmitter   =   require('../../../socket/emitter');

const getListManualProducts = async (list_id) => {
  let products = await conn.sql(`
    SELECT *, true as isManual, "הוספה ידנית" as category_name
    FROM list_manual_products mp
    WHERE mp.list_id=${list_id}
  `);

  return products;
}

const newManualProduct = async (list_id, product, io) => {
  if(!list_id || !product)
    throw new ParamsError('Failed insert NewManualProduct. Params illegal!');

  let cb = await conn.sql(`INSERT INTO list_manual_products (list_id, product_name, quantity, memo) VALUES (${list_id},"${product.product_name}", ${product.quantity}, "${product.memo}")`);
  if(!cb.insertId)
    throw Error("failed insert new manual_product");

  await socketEmitter.emitByList(io, list_id, 'updateListManualProduct' , await getListManualProduct(list_id, cb.insertId));
  return true;
}

module.exports = {
  getListManualProducts,
  newManualProduct
}
