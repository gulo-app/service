const conn            =   require('../../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../../config/errors');
const socketEmitter   =   require('../../../../socket/emitter');

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

const toggleCheck = async (list_id, product_id, io) => {
  let cb = await conn.sql(`UPDATE list_products SET isChecked = IF(isChecked=1, 0, 1) WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('toggleCheck failed');
  let productListCB = await getListProduct(list_id, product_id);
  await socketEmitter.emitByList(io, list_id, 'updateListProduct' , productListCB);
  return productListCB;
}

const updateListProduct = async (io, product) => {
  let cb = await conn.sql(`UPDATE list_products SET quantity=${product.quantity}, memo="${product.memo}" WHERE id=${product.id}`);
  if(cb.affectedRows===0)
    throw Error('update productList failed');

  await socketEmitter.emitByList(io, product.list_id, 'updateListProduct' , await getListProduct(product.list_id, product.id));
  return true;
}

const deleteListProduct = async (io, list_id, product_id) => {
  let cb = await conn.sql(`DELETE FROM list_products WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('delete productList failed');
  await socketEmitter.emitByList(io, list_id, 'deleteListProduct' , {list_id, product_id});
}

module.exports = {
  getListProduct,
  toggleCheck,
  updateListProduct,
  deleteListProduct
}
