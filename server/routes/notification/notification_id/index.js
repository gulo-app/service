const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../controller/notification/notification_id');
const auth              =   require('../../../middleware/auth');
const {RES_ERROR}       =   require('../../../config');
const {ParamsError}     =   require('../../../config/errors');

/*      notification/:id      */

router.use(async (req,res,next) => { //middleware to verify list_id
  try{
    let notification = await ctrl.getNotification(req.notification_id);
    if(notification===null)
      throw new ParamsError('notification_id invalid');

    req.notification = notification;
    next();
  }catch(e){RES_ERROR(res,e)}
})

router.get('/', (req,res) => {
  res.send(req.notification);
})

router.post('/markRead', async (req,res) => {
  try{
    await ctrl.markRead(req.notification.notification_id);
    let notification = await ctrl.getNotification(req.notification.notification_id);
    res.send(notification);
  }catch(e){RES_ERROR(res,e)}
})

router.post('/confirm', async (req,res) => {
  try{
    await ctrl.confirm(req.notification, req.app.get('io'));
    let notification = await ctrl.getNotification(req.notification.notification_id);
    res.send(notification);
  }catch(e){RES_ERROR(res,e)}
})

module.exports = router;
