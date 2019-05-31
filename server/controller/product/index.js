const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {VERIFIED_COUNTER}          =   require('../../config');
const {getListProduct}            =   require('../list/list_id/product/product_id');
const {getNotification}           =   require('../notification/notification_id');
const socketEmitter               =   require('../socket/emitter');
const {insertProduct, getList}    =   require('../list/list_id');

const getProduct = async (barcode) => {
  //let product = await conn.sql(`SELECT * FROM products WHERE barcode=${barcode}`);
  let product = await conn.sql(`
    SELECT *
    FROM products
    NATURAL JOIN brands
    NATURAL JOIN capacity_units
    NATURAL JOIN product_category pc
    NATURAL JOIN categories
    WHERE products.barcode=${barcode}
  `);
  if(product.length===0)
    return null;
  return product[0];
}

const removeProduct = async (product) => {
  await conn.sql(`DELETE FROM products WHERE barcode=${product.barcode}`);
  let brands = await conn.sql(`SELECT barcode,brand_id FROM products WHERE brand_id=${product.brand_id}`);
  if(brands.length===0) //Brand has no longer products on inventory. therefore -> will be deleted!
    await conn.sql(`DELETE FROM brands WHERE brand_id=${product.brand_id}`);

  //await conn.sql(`DELETE FROM notifications WHERE subject_id=${product.barcode}`); //remove all notifications about this barcode
}

const buildProductName = async (product) => {
  let productFullName = product.product_name;
  if(!productFullName.match(/\d+/g)){ //product_name doesn't contains digits
    productFullName = `${product.product_name} - ${product.brand_text}`;
    if(product.capacity>0){
      let capacity_units = await conn.sql(`SELECT unit_name FROM capacity_units WHERE capacity_unit_id=${product.capacity_unit_id}`);
      productFullName += ` - ${product.capacity}`;
      if(capacity_units.length===1)
        productFullName += ` ${capacity_units[0].unit_name}`;
    }
  }
  return productFullName;
}

const insertUserProduct = async (newProduct, noti, io) => {
  if(noti.subject_id!==newProduct.barcode) //check if notification is similiar to newProduct barcode. to avoid fakes notifications.
    throw new ParamsError('notification is illegal');

  newProduct.product_name = await buildProductName(newProduct); //build product fullName: product_name - brand_name - capcity - capcity_units;

  if(!newProduct.brand_id || newProduct.brand_id===0){ //if Brand not exists -> will be added to brands
    let cb = await conn.sql(`INSERT INTO brands (brand_name) values ('${newProduct.brand_text}')`);
    newProduct.brand_id = cb.insertId;
  }

  //Insert product to Products Inventory
  await conn.sql(`
    INSERT INTO products
      (barcode, product_name, brand_id, capacity, capacity_unit_id, verifiedCounter)
    VALUES
      (${newProduct.barcode}, '${newProduct.product_name}', ${newProduct.brand_id}, ${newProduct.capacity}, ${newProduct.capacity_unit_id}, ${VERIFIED_COUNTER});
  `);

  //assign category to product
  await conn.sql(`INSERT INTO product_category (category_id, barcode) VALUES (${newProduct.category_id}, ${newProduct.barcode})`);

  let list_product_id =   await insertProduct(noti.list_id, newProduct.barcode, 1); //insert newProduct into the list which the scanned device is connected to.
  let list_product    =   await getListProduct(noti.list_id, list_product_id);

  await socketEmitter.emitByList(io, noti.list_id, 'updateListProduct' , list_product);


  //UPDATE notifications for all list's users
  let rel_notis = await conn.sql(`SELECT * FROM notifications WHERE notification_type_id=3 AND status=1
                                    AND triggerBy_id=${noti.triggerBy_id}`);
  for(let tmp_noti of rel_notis){ //update Notification itself for each user in list
    /*
      for each scanNotFound product:
        only 1 user<from the list> can send newProduct form. cause if not -> verification won't be trustable.
    */
    await conn.sql(`UPDATE notifications SET status=10 WHERE notification_id=${tmp_noti.notification_id}`);
    await socketEmitter.emitByUser(io, tmp_noti.notifier_id, 'updateNotification' , await getNotification(tmp_noti.notification_id));
  }

  //UPDATE notifications for all scanners of this products. switch status from newProductForm(3,1) into verifyProduct(4,1)
  rel_notis = await conn.sql(`SELECT * FROM notifications WHERE
                    notification_type_id=3 AND status=1 AND subject_id=${noti.subject_id}`);
  for(let tmp_noti of rel_notis){ //update Notification itself for each user in list
    await conn.sql(`UPDATE notifications SET notification_type_id=4, status=1 WHERE notification_id=${tmp_noti.notification_id}`);
    await socketEmitter.emitByUser(io, tmp_noti.notifier_id, 'updateNotification' , await getNotification(tmp_noti.notification_id));
  }

  return newProduct;
}

const overwriteUserProduct = async (product, noti, io) => {
  if(noti.subject_id!==product.barcode) //check if notification is similiar to newProduct barcode. to avoid fakes notifications.
    throw new ParamsError('notification is illegal');

  await removeProduct(product);
  await insertUserProduct(product, noti, io);

  let rel_notis = await conn.sql(`SELECT * FROM notifications WHERE
                    notification_type_id=4 AND status=1 AND triggerBy_id=${noti.triggerBy_id}`);
  for(let tmp_noti of rel_notis){ //update Notification itself for each user in list
    await conn.sql(`UPDATE notifications SET status=100 WHERE notification_id=${tmp_noti.notification_id}`);
    await socketEmitter.emitByUser(io, tmp_noti.notifier_id, 'updateNotification' , await getNotification(tmp_noti.notification_id));
  }
}

const verifyProduct = async (product, noti, io) => {
  if(noti.subject_id!==product.barcode) //check if notification is similiar to newProduct barcode. to avoid fakes notifications.
    throw new ParamsError('notification is illegal');

  let newVerifiedCounter = product.verifiedCounter-1;

  if(newVerifiedCounter>=0)
    await conn.sql(`UPDATE products SET verifiedCounter=${newVerifiedCounter} WHERE barcode=${product.barcode}`); //decreament verifiedCounter

  await insertProduct(noti.list_id, product.barcode, 1);

  //update all (4,1):needToBeVerified -> (4,10):verified
  let rel_notis = await conn.sql(`SELECT * FROM notifications WHERE
                    notification_type_id=4 AND status=1 AND triggerBy_id=${noti.triggerBy_id}`);
  for(let tmp_noti of rel_notis){ //update Notification itself for each user in list
    await conn.sql(`UPDATE notifications SET status=10 WHERE notification_id=${tmp_noti.notification_id}`);
    await socketEmitter.emitByUser(io, tmp_noti.notifier_id, 'updateNotification' , await getNotification(tmp_noti.notification_id));
  }


  if(newVerifiedCounter===0){ //last verification. product offically belongs to inventory!
    rel_notis = await conn.sql(`SELECT * FROM notifications WHERE
        ((notification_type_id=3 AND status=1) OR (notification_type_id=4 AND status=1)) AND subject_id=${product.barcode}
    `);
    for(let tmp_noti of rel_notis){ //for each (3,1):scanNotFound, (4,1):needToBeVerified of this product
      await conn.sql(`DELETE notifications WHERE notification_id=${tmp_noti.notification_id}`);
      await socketEmitter.emitByUser(io, tmp_noti.notifier_id, 'deleteNotification' , tmp_noti.notification_id);
    }
  }
}


module.exports = {
  getProduct,
  insertUserProduct,
  overwriteUserProduct,
  verifyProduct
}
