const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await notification_types();
  await notification_types_status();
  await notifications();
  await fill_types();
  await fill_types_status();
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
                      isConfirm                 TINYINT(1) DEFAULT 0,

                      PRIMARY KEY (notification_type_id, status)
                  ) ENGINE=InnoDB`);
}

const notifications = async () =>{
  await conn.sql(`CREATE TABLE notifications (
                      notification_id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
                      notification_type_id      INT UNSIGNED NOT NULL,
                      status                    INT          NOT NULL,
                      notifier_id               INT UNSIGNED NOT NULL,
                      triggerBy_id              INT UNSIGNED,
                      subject_id                INT UNSIGNED,
                      createdAt                 DATETIME,
                      modifiedAt                DATETIME,
                      isRead                    TINYINT(1) DEFAULT 0,
                      isNew                     TINYINT(1) DEFAULT 1,

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


const fill_types = async () => {
  await conn.sql(`
    INSERT INTO notification_types
      (notification_type_id, topic)
    VALUES
      (1, 'שיתוף רשימה'),
      (3, 'סריקת מוצר')
  `);
}

const fill_types_status = async () => {
  /*
  1:
    1. ממתין לאישור
    2. משתמש הוסר מרשימה
    3. משתמש עזב הרשימה
    4. משתמש הצטרף לרשימה

  3:
    1. מוצר נסרק ולא זוהה -> ונסרק לראשונה
    2. מוצר נסרק ולא זוהה -> וכבר הוזן על ידי משתמש קודם. ממתין לאישור הטופס
  */
  await conn.sql(`
    INSERT INTO notification_types_status
      (notification_type_id, status, isConfirm, status_topic)
    VALUES
      (1, 1,  1, 'ממתין לאישור'),
      (1, 2, 0, 'הוסרת מרשימה זו'),
      (1, 3, 0, 'משתמש עזב הרשימה'),
      (1, 4, 0, 'משתמש הצטרף לרשימה'),
      (1, 10, 0, 'רשימת קניות שותפה בהצלחה'),
      (3, 1,  0, 'מוצר נסרק ולא זוהה'),
      (3, 2,  0, 'מוצר נסרק ולא זוהה')
  `);
}
