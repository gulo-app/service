const conn    =     require('../../../../db/connection');
const ctrl    =     require('../../../../controller/device');
module.exports = async () => {
    await devices();
    await ctrl.createDevice('ab8F');
    await ctrl.createDevice('ab8F');
    await ctrl.createDevice('ab8F');
    await ctrl.createDevice('ab8F');
    return;
}

const devices = async () => {
  await conn.sql(`CREATE TABLE devices (
                              device_id   INT UNSIGNED AUTO_INCREMENT,
                              password    VARCHAR(50) NOT NULL,

                              PRIMARY KEY (device_id)
                    ) ENGINE=InnoDB`);

  await conn.sql(`ALTER TABLE devices AUTO_INCREMENT = 1000`);
}
