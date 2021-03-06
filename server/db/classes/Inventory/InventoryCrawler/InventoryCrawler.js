const fs              =       require('fs');
const Inventory       =       require('../Inventory');
const conn            =       require('../../../../db/connection');
const ProgressBar     =       require('progress');
const manualProducts  =       require('./manual-products');

class InventoryCrawler extends Inventory{

  async fillCrawlProductsFromFile(filePath, title){
    console.log(`\n\n--------------------------------------------\n\n`);
    console.log(`${title} Crawler`);
    console.log(`--- file: ${filePath} ---`);

    let products = JSON.parse(fs.readFileSync(filePath));
    await this.fixProducts(products);

    let bar = new ProgressBar('loading [:bar] :percent :etas', { total: products.length,complete: '=', incomplete: ' ' });
    let counter = 0;
    for(let product of products){
      try{
        await this.insertCrawlProduct(product);
        counter++;
      }catch(e){

      }finally{
        bar.tick();   // process.stdout.write(`.`);
      }
    }
    console.log(`<${counter}> products inserted to db successfully`);
  }

  async fillManualProducts(){
    console.log(`\n\n--------------------------------------------\n\n`);
    console.log(`Fill Manual Products`);

    let products = manualProducts;
    let bar = new ProgressBar('loading [:bar] :percent :etas', { total: products.length,complete: '=', incomplete: ' ' });
    let counter = 0;
    for(let product of products){
      try{
        await this.insertCrawlProduct(product, false);
        counter++;
      }catch(e){
        console.log(e.message);
      }finally{
        bar.tick();   // process.stdout.write(`.`);
      }
    }
    console.log(`<${counter}> manual_products inserted to db successfully`);
  }

  async insertCrawlProduct(product){
    let new_brand = await conn.sql(`
          INSERT INTO brands (brand_name) VALUES ("${product.firm_name}")
          ON DUPLICATE KEY UPDATE brand_id = LAST_INSERT_ID(brand_id);
      `);

    let new_capacity_unit= await conn.sql(`
          INSERT INTO capacity_units (unit_name) VALUES ("${product.capacity_units_name}")
          ON DUPLICATE KEY UPDATE capacity_unit_id = LAST_INSERT_ID(capacity_unit_id);
      `);


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

      if(product.capacity_units_name === 'לקג' || product.capacity_units_name === 'קילו')
        product.capacity_units_name = 'קג';
      else if(product.capacity_units_name === 'יחי' || product.capacity_units_name === 'יחידו' || product.capacity_units_name === 'יחידות' || product.capacity_units_name === 'יח' || product.capacity_units_name === '1+C12')
        product.capacity_units_name = 'יחידה'
      else if(product.capacity_units_name === 'אורך')
        product.capacity_units_name = 'יחידה'
      else if(product.capacity_units_name === 'ליטור')
        product.capacity_units_name = 'ליטר'

      if(!product.category_id)
        product.category_id = menuIndexParser(product.menuIndex);

      if(product.barcode.toString().length<5) //remove all illegal barcodes from array
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
