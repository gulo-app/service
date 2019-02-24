const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await brands();
  await capacity_units();
  await products();
  await categories();
  await product_category();
  return;
}

const categories = async () =>{
  await conn.sql(`CREATE TABLE categories (
                      category_id INT UNSIGNED AUTO_INCREMENT,
                      category_name VARCHAR(50) NOT NULL,

                      PRIMARY KEY (category_id)
                  ) ENGINE=InnoDB`);
}
const brands = async () =>{
  await conn.sql(`CREATE TABLE brands (
                      brand_id INT UNSIGNED AUTO_INCREMENT,
                      brand_name VARCHAR(100) NOT NULL,

                      PRIMARY KEY (brand_id)
                  ) ENGINE=InnoDB`);
}
const capacity_units = async () =>{
  await conn.sql(`CREATE TABLE capacity_units (
                      capacity_unit_id INT UNSIGNED AUTO_INCREMENT,
                      unit_name VARCHAR(100) NOT NULL,
                      unit_symbol VARCHAR(20) NOT NULL,

                      PRIMARY KEY (capacity_unit_id)
                  ) ENGINE=InnoDB`);
}

const products = async () =>{
  await conn.sql(`CREATE TABLE products (
                      barcode DOUBLE NOT NULL,
                      product_name VARCHAR(200) NOT NULL,
                      brand_id INT UNSIGNED NOT NULL,
                      capacity INT UNSIGNED NOT NULL,
                      capacity_unit_id INT UNSIGNED NOT NULL,
                      memo MEDIUMTEXT,
                      verifiedCounter INT NOT NULL DEFAULT 3,

                      PRIMARY KEY (barcode),

                      FOREIGN KEY (brand_id) REFERENCES brands (brand_id) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (capacity_unit_id) REFERENCES capacity_units (capacity_unit_id) ON DELETE RESTRICT ON UPDATE CASCADE
                    ) ENGINE=InnoDB`);
}

const product_category = async () => {
  await conn.sql(`CREATE TABLE product_category (
                      category_id INT UNSIGNED NOT NULL,
                      barcode DOUBLE NOT NULL,

                      PRIMARY KEY (category_id,barcode),

                      FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (barcode) REFERENCES products (barcode) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}
