const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../controller/list/list_id');
const auth              =   require('../../../middleware/auth');
const {RES_ERROR}       =   require('../../../config');
const {ParamsError}     =   require('../../../config/errors');

/*      list/:id      */

router.use(async (req,res,next) => { //middleware to verify list_id
  try{
    let list = await ctrl.getList(req.list_id);
    if(list===null)
      throw new ParamsError('list_id invalid');

    req.list = list;
    next();
  }catch(e){RES_ERROR(res,e)}
})

router.use('/product', require('./product'));

router.get('/', (req,res) => {
  res.send(req.list);
})

module.exports = router;
