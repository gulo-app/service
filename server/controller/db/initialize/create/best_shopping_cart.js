const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await shopping_cart_firms();
  await shopping_cart_prices();
  await fill_shopping_firms();
  return;
}

const shopping_cart_firms = async () =>{
  await conn.sql(`CREATE TABLE shopping_cart_firms (
                      shopping_cart_firm_id     INT UNSIGNED AUTO_INCREMENT,
                      firm_name                 VARCHAR(100) NOT NULL,
                      firm_logo                 MEDIUMTEXT,

                      PRIMARY KEY (shopping_cart_firm_id)
                  ) ENGINE=InnoDB`);
}

const shopping_cart_prices = async () =>{
  await conn.sql(`CREATE TABLE shopping_cart_prices (
                      shopping_cart_firm_id     INT     UNSIGNED NOT NULL,
                      barcode                   DOUBLE  UNSIGNED NOT NULL,
                      price                     DOUBLE  UNSIGNED NOT NULL,
                      updatedAt                 DATETIME,

                      PRIMARY KEY (shopping_cart_firm_id, barcode),
                      FOREIGN KEY (barcode) REFERENCES products (barcode) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (shopping_cart_firm_id) REFERENCES shopping_cart_firms (shopping_cart_firm_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}

const fill_shopping_firms = async () => {
  await conn.sql(`
    INSERT INTO shopping_cart_firms
      (shopping_cart_firm_id, firm_logo, firm_name)
    VALUES
      (1, 'https://montv10.net/images/rami-levi-1.jpg', 'רמי לוי'),
      (2, 'https://lh5.ggpht.com/-8rUIbfs-RWsyEHDiPVP-eIVX27_CpNTn9mIR-zO5i5BqePnJrl_iPbj0b84J13Oe-o', 'שופרסל'),
      (3, 'https://www.bdicode.co.il/wp-content/uploads/companies/logos/yeinot%20bitan%20logo.jpg', 'יינות ביתן')
  `);
}
