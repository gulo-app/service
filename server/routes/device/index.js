const router            =   require('express').Router();
const ctrl              =   require('../../controller/device');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');
const socketEmitter     =   require('../../controller/socket/emitter');

router.post('/scan/:barcode', async (req,res) => {
  try{
    let device          =   _.pick(req.body, ['id','password']);
    let newListProduct  =   await ctrl.scan(device, req.params.barcode, req.app.get('io'));
    await socketEmitter.emitByList(req.app.get('io'), newListProduct.list_id, 'updateListProduct' , newListProduct);
    res.send(newListProduct);
  }catch(e){RES_ERROR(res,e)};
})

module.exports = router;
