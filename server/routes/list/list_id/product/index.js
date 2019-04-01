const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../../controller/list/list_id/product');
const auth              =   require('../../../../middleware/auth');
const {RES_ERROR}       =   require('../../../../config');

/*      list/:id/product      */

router.use('/:product_id(\\d+)/', (req,res,next) => { //middleware /list/:list_id/product/:product_id
  req.product_id = req.params.product_id;
  next();
}, require('./product_id'));


router.get('/', async (req,res) => {
  try{
    let list_products = await ctrl.getListProducts(req.list_id);
    res.send(list_products);
  }catch(e){RES_ERROR(res,e)}
})

module.exports = router;
