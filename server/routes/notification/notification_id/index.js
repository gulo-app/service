const router              =     require('express').Router();
const _                   =     require('lodash');
const ctrl                =     require('../../../controller/notification/notification_id');
const pCtrl               =     require('../../../controller/product');
const auth                =     require('../../../middleware/auth');
const {RES_ERROR}         =     require('../../../config');
const {ParamsError}       =     require('../../../config/errors');

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

router.delete('/', async (req, res) => {
  try{
    await ctrl.deleteNotification(req.notification.notification_id);
    res.send({notification_id: req.notification.notification_id});
  }catch(e){RES_ERROR(res,e)}
})

router.post('/newProductForm', auth, async(req,res) => {
  try{
    let {newProduct} = req.body;
    await pCtrl.insertUserProduct(newProduct, req.notification, req.app.get('io'));
    res.send();
  }catch(e){RES_ERROR(res,e)}
})

router.post('/overwriteProduct', auth, async(req,res) => {
  try{
    let {product} = req.body;
    let temp = await pCtrl.overwriteUserProduct(product, req.notification, req.app.get('io'));
    res.send({temp});
  }catch(e){RES_ERROR(res,e)}
})

router.post('/verifyProduct', auth, async(req,res) => {
  try{
    let {product} = req.body;
    let temp = await pCtrl.verifyProduct(product, req.notification, req.app.get('io'));
    res.send({temp});
  }catch(e){RES_ERROR(res,e)}
})



module.exports = router;
