const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../../../controller/list/list_id/product/product_id');
const auth              =   require('../../../../../middleware/auth');
const {RES_ERROR}       =   require('../../../../../config');
const {ParamsError}     =   require('../../../../../config/errors');
const socketEmitter     =   require('../../../../../controller/socket/emitter');

/*      list/:list_id/product/:product_id      */

router.use(async (req,res,next) => { //middleware to verify product_id
  try{
    let product = await ctrl.getListProduct(req.list_id, req.product_id);
    if(product===null)
      throw new ParamsError('product_id invalid');

    req.list['product'] = product;
    next();
  }catch(e){RES_ERROR(res,e)}
})

router.get('/', async (req,res) => {
  res.send(req.list['product']);
})

router.post('/toggleCheck', async (req,res) => {
  try{
    let productListCB = await ctrl.toggleCheck(req.list_id, req.product_id);
    await socketEmitter.emitByList(req.app.get('io'), req.list_id, 'updateListProduct' , productListCB);
    res.send(productListCB);
  }catch(e){RES_ERROR(res,e)}
})
module.exports = router;
