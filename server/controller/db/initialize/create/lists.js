const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await list_types();
  await lists();
  await list_shares();
  await list_products();
  await list_manual_products();
  return;
}

const list_types = async () =>{
  await conn.sql(`
    CREATE TABLE list_types (
              list_type_id      INT UNSIGNED AUTO_INCREMENT,
              list_type_name    VARCHAR(50) NOT NULL,
              list_type_color   VARCHAR(20) NOT NULL,
              list_type_icon    VARCHAR(20) NOT NULL,

              PRIMARY KEY (list_type_id)
    ) ENGINE=InnoDB`);

  await conn.sql(`
      INSERT INTO list_types
        (list_type_color, list_type_icon, list_type_name)
      VALUES
        ('#f95d49','home', 'בית'),
        ('#aa48fa','hotel', 'דירה'),
        ('#48fa94','desktop', 'משרד'),
        ('#2cdded','archive', 'שונות')
  `);
}

const lists = async () =>{
  await conn.sql(`CREATE TABLE lists (
                      list_id       INT UNSIGNED AUTO_INCREMENT,
                      user_id       INT UNSIGNED NOT NULL,
                      list_name     VARCHAR(100) NOT NULL,
                      list_type_id  INT UNSIGNED NOT NULL,
                      device_id     INT UNSIGNED,
                      modified_at   DATETIME NOT NULL,

                      PRIMARY KEY (list_id),
                      UNIQUE KEY(device_id),
                      FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                      FOREIGN KEY (list_type_id) REFERENCES list_types (list_type_id) ON DELETE RESTRICT ON UPDATE CASCADE,
                      FOREIGN KEY (device_id) REFERENCES devices (device_id) ON DELETE SET NULL ON UPDATE CASCADE
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
                      memo        MEDIUMTEXT  DEFAULT NULL,

                      PRIMARY KEY (id),
                      UNIQUE  KEY (list_id, barcode),
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
                      memo        MEDIUMTEXT  DEFAULT NULL,

                      PRIMARY KEY (id),
                      FOREIGN KEY (list_id) REFERENCES lists    (list_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);
}
