const fs          =     require('fs');
const path        =     require('path');
const FILE_PATH   =     path.join(__dirname, '../../../crawler/output/output.json');
const conn    =     require('../../../../../db/connection');

module.exports = async () => {
      let products = JSON.parse(fs.readFileSync(FILE_PATH));
      await fixProducts(products);
      await insertProductsToDB(products);
      return false;
}

const insertProductsToDB = async (products) => {
  console.log(`insert products into DB: `);
  for(let product of products){
    let new_brand = await conn.sql(`
          INSERT INTO brands (brand_name) VALUES ("${product.firm_name}")
          ON DUPLICATE KEY UPDATE brand_id = LAST_INSERT_ID(brand_id);
      `);
    let new_capacity_unit = await conn.sql(`
          INSERT INTO capacity_units (unit_name) VALUES ("${product.capacity_units_name}")
          ON DUPLICATE KEY UPDATE capacity_unit_id = LAST_INSERT_ID(capacity_unit_id);
      `);

    await conn.sql(`
        INSERT INTO gulo.products
          (barcode, product_name, brand_id, capacity, capacity_unit_id)
        VALUES
          (${product.barcode}, "${product.product_name}", ${new_brand.insertId}, ${product.capacity}, ${new_capacity_unit.insertId})
    `);
    process.stdout.write(`.`);
  }
  process.stdout.write(`\n`);
  console.log(`<${products.length}> products inserted to db successfully`);
}

const fixProducts = async (products) => {
  for(let product of products){
    product.firm_name     =   product.firm_name   ?   product.firm_name.replace(/"/g,"''") : null;
    product.product_name  =   product.product_name.replace(/"/g,"''");
    product.capacity      =   product.capacity || 0;

    if(product.capacity_units_name === 'לקג')
      product.capacity_units_name = 'קג';
    else if(product.capacity_units_name === 'יחי')
      product.capacity_units_name = 'יחידה'
  }
}
