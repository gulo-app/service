const conn    =     require('../../../../db/connection');

module.exports = async () => {
    let usersSQL = `CREATE TABLE 238_users (
                                user_id INT UNSIGNED AUTO_INCREMENT,
                                mail VARCHAR(50) NOT NULL,
                                googleToken VARCHAR(100) NOT NULL,
                                firstname VARCHAR(50) NOT NULL,
                                lastname VARCHAR(50) NOT NULL,

                                PRIMARY KEY (user_id)
                      ) ENGINE=InnoDB`;
    await conn.sql(usersSQL);
    return;
}
