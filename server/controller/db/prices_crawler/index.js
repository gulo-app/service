const fs              =       require('fs');
const path            =       require('path');
const conn            =       require('../../../db/connection');
const ProgressBar     =       require('progress');
const PRICES_PATH     =       path.join(`${process.env.PWD}/controller/db/prices_crawler/output/prices.json`);

const updatePrices = async () => {
  let prices = JSON.parse(fs.readFileSync(PRICES_PATH));

  console.log(`\n\n--------------------------------------------\n\n`);
  console.log(`*** update products PRICES ***`);
  let bar = new ProgressBar('loading [:bar] :percent :etas', { total: prices.length,complete: '=', incomplete: ' ' });
  console.log(prices.length);

  for(let product of prices){
    try{
      if(product.barcode.toString().length<10){ //remove all illegal barcodes from array
        bar.tick();
        continue;
      }
      await conn.sql(`INSERT INTO shopping_cart_prices
                        (shopping_cart_firm_id, barcode, price, updatedAt)
                      VALUES
                        (${product.shopping_cart_firm_id}, ${product.barcode}, ${product.price}, NOW())
                      ON DUPLICATE KEY UPDATE price=${product.price}
      `);

      bar.tick();
    }catch(e){
      if(e.errno!==1452) //duplicate key error should be ignored!
        console.log(e);
      bar.tick();
    }
  }
}

module.exports = {
  updatePrices
}
