const conn    =     require('../../../../db/connection');

module.exports = async () => {
    await users();
    return;
}

const users = async () => {
  await conn.sql(`CREATE TABLE users (
                              user_id INT UNSIGNED AUTO_INCREMENT,
                              mail        VARCHAR(50)   NOT NULL,
                              firstname   VARCHAR(50)   NOT NULL,
                              lastname    VARCHAR(50)   NOT NULL,
                              points      INT UNSIGNED  DEFAULT 0,
                              googleID    VARCHAR(100)          ,
                              facebookID  VARCHAR(100)          ,
                              pic         MEDIUMTEXT            ,

                              PRIMARY KEY (user_id),
                              UNIQUE KEY(mail)
                    ) ENGINE=InnoDB`);
}
