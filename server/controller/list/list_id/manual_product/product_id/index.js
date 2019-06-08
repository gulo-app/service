const conn            =   require('../../../../../db/connection');
const {ParamsError, AuthError}   =   require('../../../../../config/errors');
const socketEmitter   =   require('../../../../socket/emitter');

const getListManualProduct = async (list_id, product_id) => {
  let product = await conn.sql(`
    SELECT *, true as isManual, "הוספה ידנית" as category_name
    FROM list_manual_products mp
    WHERE mp.id=${product_id} AND mp.list_id=${list_id}
  `);
  if(product.length===0)
    return null;
  return product[0];
}

const toggleCheck = async (list_id, product_id, io) => {
  let cb = await conn.sql(`UPDATE list_manual_products SET isChecked = IF(isChecked=1, 0, 1) WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('toggleCheck failed');
  let productListCB = await getListManualProduct(list_id, product_id);
  await socketEmitter.emitByList(io, list_id, 'updateListManualProduct' , productListCB);
  return productListCB;
}

const updateListManualProduct = async (io, product) => {
  let cb = await conn.sql(`UPDATE list_manual_products SET quantity=${product.quantity}, memo="${product.memo}" WHERE id=${product.id}`);
  if(cb.affectedRows===0)
    throw Error('updateListManualProduct failed');

  await socketEmitter.emitByList(io, product.list_id, 'updateListManualProduct' , await getListManualProduct(product.list_id, product.id));
  return true;
}

const deleteListManualProduct = async (io, list_id, product_id) => {
  let cb = await conn.sql(`DELETE FROM list_manual_products WHERE id=${product_id} AND list_id=${list_id}`);
  if(cb.affectedRows===0)
    throw Error('delete productList failed');
  await socketEmitter.emitByList(io, list_id, 'deleteListManualProduct' , {list_id, product_id});
}

module.exports = {
  getListManualProduct,
  toggleCheck,
  updateListManualProduct,
  deleteListManualProduct
}
