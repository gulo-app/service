const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await notification_types();
  await notification_types_status();
  await notifications();
  return;
}

const notification_types = async () =>{
  await conn.sql(`CREATE TABLE notification_types (
                      notification_type_id     INT UNSIGNED AUTO_INCREMENT,
                      topic                     VARCHAR(100) NOT NULL,

                      PRIMARY KEY (notification_type_id)
                  ) ENGINE=InnoDB`);
}

const notification_types_status = async () =>{
  await conn.sql(`CREATE TABLE notification_types_status (
                      notification_type_id      INT UNSIGNED NOT NULL,
                      status                    INT NOT NULL,
                      status_topic              VARCHAR(100),

                      PRIMARY KEY (notification_type_id, status)
                  ) ENGINE=InnoDB`);
}

const notifications = async () =>{
  await conn.sql(`CREATE TABLE notifications (
                      notification_id           INT UNSIGNED NOT NULL,
                      notification_type_id      INT UNSIGNED NOT NULL,
                      status                    INT          NOT NULL,
                      notifier_id               INT UNSIGNED NOT NULL,
                      id_1                      INT UNSIGNED,
                      id_2                      INT UNSIGNED,
                      createdAt                 DATETIME,
                      modifiedAt                DATETIME,
                      isRead                    TINYINT(1) DEFAULT 0,

                      PRIMARY KEY (notification_id),
                      FOREIGN KEY (notifier_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
                  ) ENGINE=InnoDB`);

  //TRIGGERS:
  await conn.sql(`
                    CREATE TRIGGER before_insert_notifications
                    BEFORE INSERT ON notifications
                    FOR EACH ROW
                    BEGIN
                      SET NEW.createdAt = NOW();
                      SET NEW.modifiedAt = NOW();
                    END
                `);
  await conn.sql(`
                    CREATE TRIGGER before_update_notifications
                    BEFORE UPDATE ON notifications
                    FOR EACH ROW
                    BEGIN
                      SET NEW.modifiedAt = NOW();
                    END
                `);
}
