const conn            =   require('../../db/connection');
const {ParamsError, AuthError}   =   require('../../config/errors');
const isListBelongsToUser = require('../list');


const addProduct = async (user_id, list_id, barcode, quantity) => {
    //check if user owen list
    let userHavePermissions = await isListBelongsToUser(user_id,list_id);
    if(!userHavePermissions)
        throw new AuthError(`Permission denied`);
    
    //check if barcode in products table - if not ask the user to add it
    let barcodeExist = await isBarcodeExist(barcode); 
    if(!barcodeExist)
        return false;

    //add product to user's list   
    let result = await conn.sql(`INSERT INTO list_products (list_id, barcode, quantity) 
                                 VALUES (${list_id}, ${barcode}, ${quantity})`);
    return true;
}

const isBarcodeExist = async (barcode) => {
    let result = await conn.sql(`SELECT * FROM products WHERE barcode= ${barcode}`);

    if(result.length===0)
        return false;
    
    return true;    
}

module.exports = {
    addProduct
}