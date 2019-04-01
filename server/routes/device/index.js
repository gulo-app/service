const router            =   require('express').Router();
const ctrl              =   require('../../controller/device');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');

router.post('/scan/:barcode', async (req,res) => {
  try{
    console.log("device route");
    let device  =   _.pick(req.body, ['id','password']);
    let cb      =   await ctrl.scan(device, req.params.barcode);
    res.send(cb);
  }catch(e){RES_ERROR(res,e)};
})

module.exports = router;
