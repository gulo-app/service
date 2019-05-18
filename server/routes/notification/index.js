const router            =   require('express').Router();
const ctrl              =   require('../../controller/notification');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');


router.use('/:notification_id(\\d+)/', (req,res,next) => {
  req.notification_id = req.params.notification_id;
  next();
}, require('./notification_id'));


//get all notifications by userId
router.get('/', auth, async (req,res) => {
  try {
    let notifications = await ctrl.getAllNotifications(req.user);
    res.send(notifications);
  }
  catch(e){RES_ERROR(res,e)}
})

router.post('/unNew', auth, async (req,res) => {
  try {
    await ctrl.unNewNotifications(req.user);
    let notifications = await ctrl.getAllNotifications(req.user);
    res.send(notifications);
  }
  catch(e){RES_ERROR(res,e)}
})


module.exports = router;
