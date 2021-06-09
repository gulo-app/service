const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../../../controller/list/list_id/manual_product/product_id');
const auth              =   require('../../../../../middleware/auth');
const {RES_ERROR}       =   require('../../../../../config');
const {ParamsError}     =   require('../../../../../config/errors');
const socketEmitter     =   require('../../../../../controller/socket/emitter');

/*      list/:list_id/product/:product_id      */

router.use(async (req,res,next) => { //middleware to verify product_id
  try{    
    let product = await ctrl.getListManualProduct(req.list_id, req.product_id);
    if(product===null)
      throw new ParamsError('product_id invalid');

    req.list['product'] = product;
    next();
  }catch(e){RES_ERROR(res,e)}
})

router.get('/', auth, async (req,res) => {
  res.send(req.list['product']);
})

router.put('/', auth, async(req,res) => {
  try{
    let {product} = req.body;
    let cb = await ctrl.updateListManualProduct(req.app.get('io'), product);
    res.send({cb});
  }catch(e){RES_ERROR(res,e)}
})

router.delete('/', auth, async(req,res) => {
  try{
    let cb = await ctrl.deleteListManualProduct(req.app.get('io'), req.list_id, req.product_id);
    res.send({cb});
  }catch(e){RES_ERROR(res,e)}
})

router.post('/toggleCheck', auth, async (req,res) => {
  try{
    let productListCB = await ctrl.toggleCheck(req.list_id, req.product_id, req.app.get('io'));
    res.send(productListCB);
  }catch(e){RES_ERROR(res,e)}
})

module.exports = router;
