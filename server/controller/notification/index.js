const conn                        =   require('../../db/connection');
const {ParamsError, AuthError}    =   require('../../config/errors');
const {buildNotification, getNotification}         =   require('./notification_id');
const socketEmitter               =   require('../socket/emitter');

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
  return await addNotification(io, 3, 1, notifier_id, triggerBy_id, barcode);
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
  scanNotExists
}
