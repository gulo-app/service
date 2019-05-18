const conn                        =   require('../../../db/connection');
const {ParamsError, AuthError}    =   require('../../../config/errors');
const {getUserByID}               =   require('../../user');
const socketEmitter               =   require('../../socket/emitter');

const buildNotification = async (noti) => {
  noti.triggerBy  =   await getUserByID(noti.triggerBy_id);
  let {notification_type_id, status} = noti;

  switch(notification_type_id){
    case 1: //shared list
      noti.subject  =  await require('../../list/list_id').getList(noti.subject_id);
      if(status===1 || status===10) //request to share list
        noti.title = `הוזמנת על ידי ${noti.triggerBy.firstname} ${noti.triggerBy.lastname} לערוך את הרשימה <${noti.subject.list_name}>`;

      break;
  }
}

const getNotification = async (notification_id) => {
  let cb = await conn.sql(`
    SELECT *
    FROM notifications
    NATURAL JOIN notification_types
    NATURAL JOIN notification_types_status
    WHERE notification_id=${notification_id}
  `);
  if(cb.length===0)
    return null;

  let noti = cb[0];
  await buildNotification(noti);
  return noti;
}

const markRead = async (notification_id) => {
  let cb = await conn.sql(`UPDATE notifications SET isRead=1 WHERE notification_id=${notification_id}`);
  if(cb.affectedRows===0)
    return false;

  return true;
}

const confirm = async (noti, io) => {
  if(noti.isConfirm!==1)
    return false;
  let type    =   noti.notification_type_id;
  let status  =   noti.status;

  if(type===1 && status===1)
    await confirmSharedList(noti.notifier_id, noti.subject_id, noti.notification_id, io);

  return true;
}

const confirmSharedList = async (user_id, list_id, noti_id, io) => {
  if(!user_id || !list_id)
    return false;

  await conn.sql(`UPDATE notifications SET status=10 WHERE notification_id=${noti_id}`);
  await conn.sql(`INSERT INTO list_shares (user_id, list_id) VALUES (${user_id}, ${list_id})`);

  let theList = await require('../../list/list_id').getList(list_id);
  await socketEmitter.emitByUser(io, user_id, 'newList' , theList); //notify client that NewList is Available
  return true;
};

module.exports = {
  getNotification,
  buildNotification,
  markRead,
  confirm
}
