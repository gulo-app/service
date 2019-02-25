const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await lists();
  await list_shares();
  await list_products();
  await list_manual_products();
  return;
}

const lists = async () =>{
  await conn.sql(`CREATE TABLE lists (
                      list_id     INT UNSIGNED AUTO_INCREMENT,
                      user_id     INT UNSIGNED NOT NULL,
                      list_name   VARCHAR(100) NOT NULL,

                      PRIMARY KEY (list_id),
                      FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}

const list_shares = async () =>{
  await conn.sql(`CREATE TABLE list_shares (
                      list_id     INT UNSIGNED NOT NULL,
                      user_id     INT UNSIGNED NOT NULL,

                      PRIMARY KEY (list_id, user_id),
                      FOREIGN KEY (list_id) REFERENCES lists (list_id) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}

const list_products = async () =>{
  await conn.sql(`CREATE TABLE list_products (
                      id          INT         UNSIGNED AUTO_INCREMENT,
                      list_id     INT         UNSIGNED NOT NULL,
                      barcode     DOUBLE      UNSIGNED NOT NULL,
                      quantity    INT         UNSIGNED NOT NULL,
                      isChecked   TINYINT(1)  DEFAULT 0,

                      PRIMARY KEY (id),
                      FOREIGN KEY (list_id) REFERENCES lists    (list_id) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (barcode) REFERENCES products (barcode) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}

const list_manual_products = async () =>{
  await conn.sql(`CREATE TABLE list_manual_products (
                      id            INT           UNSIGNED AUTO_INCREMENT,
                      list_id       INT           UNSIGNED NOT NULL,
                      product_name  VARCHAR(100)  NOT NULL         ,
                      quantity      INT           UNSIGNED NOT NULL,
                      isChecked     TINYINT(1)    DEFAULT 0,

                      PRIMARY KEY (id),
                      FOREIGN KEY (list_id) REFERENCES lists    (list_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}
