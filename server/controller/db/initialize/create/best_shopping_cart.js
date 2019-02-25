const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await shopping_cart_firms();
  await shopping_cart_prices();
  return;
}

const shopping_cart_firms = async () =>{
  await conn.sql(`CREATE TABLE shopping_cart_firms (
                      shopping_cart_firm_id     INT UNSIGNED AUTO_INCREMENT,
                      firm_name                 VARCHAR(100) NOT NULL,

                      PRIMARY KEY (shopping_cart_firm_id)
                  ) ENGINE=InnoDB`);
}

const shopping_cart_prices = async () =>{
  await conn.sql(`CREATE TABLE shopping_cart_prices (
                      shopping_cart_firm_id     INT     UNSIGNED NOT NULL,
                      barcode                   DOUBLE  UNSIGNED NOT NULL,
                      price                     DOUBLE  UNSIGNED NOT NULL,
                      updatedAt                 DATETIME,

                      PRIMARY KEY (shopping_cart_firm_id, barcode)
                  ) ENGINE=InnoDB`);
}
