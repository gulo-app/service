const router            =   require('express').Router();
const ctrl              =   require('../../controller/device');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');
const socketEmitter     =   require('../../controller/socket/emitter');

router.post('/scan/:barcode', async (req,res) => {
  try{
    let device = _.pick(req.body, ['id','password']);

    await ctrl.scan(device, req.params.barcode, req.app.get('io'));
    res.send(`barcode [${req.params.barcode}] scanned successfully`);
  }catch(e){RES_ERROR(res,e)};
})

router.post('/scanByMobile/:list_id/:barcode', async (req,res) => {
  try{
    await ctrl.scanByMobile(req.user, req.params.list_id, req.params.barcode, req.app.get('io'));
    res.send();
  }catch(e){RES_ERROR(res,e)};
})


module.exports = router;
