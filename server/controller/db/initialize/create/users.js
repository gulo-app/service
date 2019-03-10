const conn    =     require('../../../../db/connection');

module.exports = async () => {
    await users();
    return;
}

const users = async () => {
  await conn.sql(`CREATE TABLE users (
                              user_id INT UNSIGNED AUTO_INCREMENT,
                              mail      VARCHAR(50)   NOT NULL,
                              googleID  VARCHAR(100)  NOT NULL,
                              firstname VARCHAR(50)   NOT NULL,
                              lastname  VARCHAR(50)   NOT NULL,
                              pic       VARCHAR(200)          ,
                              points    INT UNSIGNED  DEFAULT 0,

                              PRIMARY KEY (user_id),
                              UNIQUE KEY(mail)
                    ) ENGINE=InnoDB`);
}
