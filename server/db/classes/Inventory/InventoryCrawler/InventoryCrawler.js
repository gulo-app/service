const fs            =       require('fs');
const Inventory     =       require('../Inventory');
const conn          =       require('../../../../db/connection');
const ProgressBar   =       require('progress');

class InventoryCrawler extends Inventory{

  async fillCrawlProductsFromFile(filePath, title){
    console.log(`\n\n--------------------------------------------\n\n`);
    console.log(`${title} Crawler`);
    console.log(`--- file: ${filePath} ---`);

    let products = JSON.parse(fs.readFileSync(filePath));
    await this.fixProducts(products);

    let bar = new ProgressBar('loading [:bar] :percent :etas', { total: products.length,complete: '=', incomplete: ' ' });

    for(let product of products){
      try{
        await this.insertCrawlProduct(product, title==='Shufersal' ? true : false);
      }catch(e){

      }finally{
        bar.tick();   // process.stdout.write(`.`);
      }

    }
    console.log(`<${products.length}> products inserted to db successfully`);
  }

  async insertCrawlProduct(product, isShufersal){
    let new_brand = await conn.sql(`
          INSERT INTO brands (brand_name) VALUES ("${product.firm_name}")
          ON DUPLICATE KEY UPDATE brand_id = LAST_INSERT_ID(brand_id);
      `);

    let new_capacity_unit = {};
    if(isShufersal){
        new_capacity_unit.insertId = product.capacity_units_name;
    } else {
      new_capacity_unit= await conn.sql(`
            INSERT INTO capacity_units (unit_name) VALUES ("${product.capacity_units_name}")
            ON DUPLICATE KEY UPDATE capacity_unit_id = LAST_INSERT_ID(capacity_unit_id);
        `);
    }


    await conn.sql(`
        INSERT IGNORE INTO products
          (barcode, product_name, brand_id, capacity, capacity_unit_id, verifiedCounter)
        VALUES
          (${product.barcode}, "${product.product_name}", ${new_brand.insertId}, ${product.capacity}, ${new_capacity_unit.insertId}, 0)
    `);

    await conn.sql(`
        INSERT IGNORE INTO product_category
          (barcode, category_id)
        VALUES
          (${product.barcode}, ${product.category_id})
    `);
  }

  async fixProducts(products){
    for(let i=products.length-1; i>=0; i--){
      let product = products[i];

      product.firm_name     =   product.firm_name   ?   product.firm_name.replace(/"/g,"''") : null;
      product.product_name  =   product.product_name.replace(/"/g,"''");
      product.capacity      =   product.capacity || 0;

      if(product.capacity_units_name === 'לקג')
        product.capacity_units_name = 'קג';
      else if(product.capacity_units_name === 'יחי')
        product.capacity_units_name = 'יחידה'

      if(!product.category_id)
        product.category_id = menuIndexParser(product.menuIndex);

      if(product.barcode.toString().length<10) //remove all illegal barcodes from array
        products.splice(i,1);
    }
  }
}

const menuIndexParser = (menuIndex) =>{
        /*
        1. מזון
        2. חד פעמי
        3. אחזקת הבית
        4. טיפוח ותינוקות
        5. ביגוד
        6. מוצרי חשמל
        */
        if(menuIndex<=10 || menuIndex===16)
          return 1;
        else if(menuIndex>10)
          return menuIndex-9;
}

module.exports = InventoryCrawler;
