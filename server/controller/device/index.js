const conn                                    =   require('../../db/connection');
const generatePassword                        =   require('generate-password');
const _                                       =   require('lodash');
const {getProduct}                            =   require('../product');
const {getListProduct}                        =   require('../list/list_id/product/product_id');
const ctrlNotify                              =   require('../notification');
const {insertProduct, forEachUserInList}      =   require('../list/list_id');
const {ParamsError, AuthError, ScanError}     =   require('../../config/errors');


const verifyDevice = async (device) => {
  if(!device.id || !device.password)
    return false;
  device.id       =   _.trim(device.id);
  device.password =   _.trim(device.password);
  let deviceCB = await conn.sql(`SELECT device_id FROM devices WHERE device_id=${device.id} AND BINARY password='${device.password}'`);
  if(deviceCB.length===0)
    return false;
  return true;
}

const isDeviceConnected = async (device_id) => {
  let list = await conn.sql(`SELECT list_id FROM lists WHERE device_id=${device_id}`);
  if(list.length===0)
    return false;
  return true;
}

const getDeviceListID = async (device_id) => {
  let list = await conn.sql(`SELECT list_id FROM lists WHERE device_id=${device_id}`);
  if(list.length===0)
    return null;
  return list[0].list_id;
}

const createDevice = async (password) => {
  if(!password){
    password = generatePassword.generate({
        length: 4,
        numbers: true
    });
  }

  let newDevice = await conn.sql(`INSERT INTO devices (password) VALUES ('${password}')`);

  return await conn.sql(`SELECT * FROM devices WHERE device_id=${newDevice.insertId}`);
}

const scan = async(device, barcode, io) => {
  if(!barcode || !device || !device.id || !device.password || isNaN(device.id))
    throw new ParamsError('params invalid');
  if(await verifyDevice(device)===false)
    throw new AuthError('device details invalid');

  let list_id = await getDeviceListID(device.id);
  if(!list_id)
    throw new AuthError('device not connected');

  let product = await getProduct(barcode);
  if(!product){ // *** PRODUCT NOT EXISTS AT ALL. send notification to all List's users
    await forEachUserInList(list_id, async (notifier_id) => {
        await ctrlNotify.scanNotExists(io, notifier_id, device.id, barcode);
    });
    throw new ScanError('product not exists on inventory');
  }

  let product_id = await insertProduct(list_id, product.barcode);
  if(!product_id)
    throw new ScanError('insert product to list failed');

  return await getListProduct(list_id, product_id);
}

module.exports = {
  createDevice,
  verifyDevice,
  isDeviceConnected,
  scan
}
