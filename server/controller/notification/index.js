const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {buildNotification, getNotification}         =   require('./notification_id');
const socketEmitter               =   require('../socket/emitter');
const fbAdmin                     =   require('../../firebase');


const addNotification = async (io, type, status, notifier_id, triggerBy_id, subject_id) => {
  let cb = await conn.sql(`
    INSERT INTO notifications
      (notification_type_id, status, notifier_id, triggerBy_id, subject_id)
    VALUES
      (${type}, ${status}, ${notifier_id}, ${triggerBy_id}, ${subject_id})
  `);
  if(cb.insertId===0)
    return false;

  let notification =  await getNotification(cb.insertId);
  await socketEmitter.emitByUser(io, notifier_id, 'newNotification' , notification);
  return notification;
}

const sendFirebaseNotification = async (notification) => {
  // fbAdmin.messaging().sendToDevice(registrationToken, payload, options)
  // .then(function(response) {
  //   console.log("Successfully sent message:", response);
  // })
  // .catch(function(error) {
  //   console.log("Error sending message:", error);
  // });
}

const updateFirebaseNotificationToken = async (user, token) => {
  await conn.sql(`INSERT IGNORE INTO firebase_notification_tokens (user_id, noti_token) VALUES (${user.user_id}, "${token}")`);
  return true;
}

const shareListRequest = async (io, notifier_id, triggerBy_id, list_id) => {
  return await addNotification(io, 1, 1, notifier_id, triggerBy_id, list_id);
}
const removedFromList = async (io, notifier_id, triggerBy_id, list_id) => {
  await conn.sql(`DELETE FROM notifications WHERE notifier_id=${notifier_id} AND subject_id=${list_id}`);
  return await addNotification(io, 1, 2, notifier_id, triggerBy_id, list_id);
}
const leaveList = async (io, notifier_id, triggerBy_id, list_id) => {
  return await addNotification(io, 1, 3, notifier_id, triggerBy_id, list_id);
}
const joinList = async (io, notifier_id, triggerBy_id, list_id) => {
  return await addNotification(io, 1, 4, notifier_id, triggerBy_id, list_id);
}

const scanNotExists = async (io, notifier_id, triggerBy_id, barcode) => {
  let notis = await conn.sql(`SELECT notification_id, notifier_id,subject_id FROM notifications WHERE
                              notification_type_id=3 AND notifier_id=${notifier_id} AND subject_id=${barcode}`);
  if(notis.length===0) //if has no notification about this product yet -> create one
    return await addNotification(io, 3, 1, notifier_id, triggerBy_id, barcode);

  for(let noti of notis){  //otherwise -> only set flag isRead=0
    await conn.sql(`UPDATE notifications SET isRead=0 WHERE notification_id=${noti.notification_id}`);
    await socketEmitter.emitByUser(io, noti.notifier_id, 'updateNotification' , await getNotification(noti.notification_id));
  }
  return true;
}

const verifyInsertedProduct = async (io, notifier_id, triggerBy_id, barcode) => {
  let notis = await conn.sql(`SELECT notification_id, notifier_id FROM notifications WHERE
                              notification_type_id=4 AND notifier_id=${notifier_id} AND subject_id=${barcode}`);

  if(notis.length===0) //send notification only if not exists yet
    return await addNotification(io, 4, 1, notifier_id, triggerBy_id, barcode);

  for(let noti of notis){ //otherwise -> set flag isRead=0
    await conn.sql(`UPDATE notifications SET isRead=0 WHERE notification_id=${noti.notification_id}`);
    await socketEmitter.emitByUser(io, noti.notifier_id, 'updateNotification' , await getNotification(noti.notification_id));
  }
  return true;
}


const getAllNotifications = async (user) => {
  let notifications = await conn.sql(`
    SELECT *
    FROM notifications
    NATURAL JOIN notification_types
    NATURAL JOIN notification_types_status
    WHERE notifier_id=${user.user_id}
    ORDER BY modifiedAt desc
  `);
  for(let noti of notifications){
    await buildNotification(noti);
  }

  return notifications;
}

const unNewNotifications = async (user) => {
  let cb = await conn.sql(`UPDATE notifications SET isNew=0 WHERE notifier_id=${user.user_id}`);
  if(cb.affectedRows===0)
    return false;
  return true;
}


module.exports = {
  shareListRequest,
  removedFromList,
  leaveList,
  joinList,
  getAllNotifications,
  unNewNotifications,
  scanNotExists,
  verifyInsertedProduct,
  updateFirebaseNotificationToken
}
