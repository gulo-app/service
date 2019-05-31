const conn                        =   require('../../../db/connection');
const {ParamsError, AuthError}    =   require('../../../config/errors');
const {getUserByID}               =   require('../../user');
const socketEmitter               =   require('../../socket/emitter');

const buildNotification = async (noti) => {
  let {notification_type_id, status} = noti;
  noti.title = {primary: '', secondary: ''};

  switch(notification_type_id){
    case 1: //shared list
      noti.triggerBy  =   await getUserByID(noti.triggerBy_id);
      noti.subject    =   await require('../../list/list_id').getList(noti.subject_id);
      let triggerName = `${noti.triggerBy.firstname} ${noti.triggerBy.lastname}`;
      if(status===1){ //request to share list
        noti.title.primary    = `הוזמנת על ידי <${triggerName}> לערוך את הרשימה <${noti.subject.list_name}>`;
        noti.title.secondary  = `ממתין לאישור`
      }if(status===2){ //removed from shared list
        noti.title.primary    = `הוסרת מהרשימה <${noti.subject.list_name}> על ידי <${triggerName}>`;
      }if(status===3){
        noti.title.primary    = `המשתמש <${triggerName}> עזב את הרשימה <${noti.subject.list_name}>`;
      }if(status===4){
        noti.title.primary    = `המשתמש <${triggerName}> הצטרף לרשימה <${noti.subject.list_name}>`;
      }if(status===10){
        noti.title.primary    = `הוזמנת על ידי <${triggerName}> לערוך את הרשימה <${noti.subject.list_name}>`;
        noti.title.secondary  = `רשימת קניות שותפה בהצלחה`;
      }
      break;

    case 3: //scan not exists
      noti.list_id  =  await require('../../device').getDeviceListID(noti.triggerBy_id);
      if(status===1){ //scan not exists at all
        noti.title.primary    =   `מוצר נסרק ולא זוהה`;
        noti.title.secondary  =   `ברקוד: <${noti.subject_id}>`;
      }if(status===10){
        noti.title.primary    =   `מוצר נסרק ולא זוהה`;
        noti.title.secondary  =   `המוצר <${noti.subject_id}> הוזן למערכת`;
      }
      break;
    case 4: //verify product after scanned
      noti.list_id  =  await require('../../device').getDeviceListID(noti.triggerBy_id);
      noti.product  =  await require('../../product').getProduct(noti.subject_id);
      if(status===1){
        noti.title.primary    =   `מוצר נסרק ולא זוהה`;
        noti.title.secondary  =   `ברקוד: <${noti.subject_id}> ממתין לאימות`;
      }if(status===10){
        noti.title.primary    =   `מוצר נסרק ולא זוהה`;
        noti.title.secondary  =   `המוצר <${noti.subject_id}> אומת בהצלחה`;
      }
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

  if(type===1 && status===1){ //confirm shared list
    await confirmSharedList(noti.notifier_id, noti.subject_id, noti.notification_id, io);
  }
  return true;
}

const confirmSharedList = async (user_id, list_id, noti_id, io) => {
  if(!user_id || !list_id)
    return false;

  await conn.sql(`UPDATE notifications SET status=10 WHERE notification_id=${noti_id}`);
  await conn.sql(`INSERT INTO list_shares (user_id, list_id) VALUES (${user_id}, ${list_id})`);

  let theList = await require('../../list/list_id').getList(list_id);
  await require('../../notification').joinList(io, theList.creator.user_id, user_id, list_id);
  await socketEmitter.emitByUser(io, user_id, 'newList' , theList); //notify client that NewList is Available
  await socketEmitter.emitByList(io, theList.list_id, 'listUpdated' , theList);
  return true;
};

const deleteNotification = async (noti_id) => {
  if(!noti_id)
    return false;
  let cb = await conn.sql(`DELETE FROM notifications WHERE notification_id=${noti_id}`);
  if(cb.affectedRows!==1)
    throw Error('notification delete failed');
  return true;
};

module.exports = {
  getNotification,
  buildNotification,
  markRead,
  confirm,
  deleteNotification
}
