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

    await ctrl.updateListModifiedAt(req.list_id, req.app.get('io')); //for every list_id CALL_API: update the list modified_at field and emit to list's clients by SocketEmitter
    req.list = list;
    next();
  }catch(e){RES_ERROR(res,e)}
})

router.use('/product', require('./product'));
router.use('/manual_product', require('./manual_product'));

router.get('/', (req,res) => {
  res.send(req.list);
})

//update specific list by id
router.put('/', auth, async (req,res) => {
  try {
    let cb = await ctrl.updateList(req.body, req.user, req.app.get('io'));
    res.send(cb);
  }catch(e){RES_ERROR(res,e)}
})

// delete list by id
router.delete('/', auth, async (req,res) => {
  try {
    let cb = await ctrl.deleteList(req.user, req.list, req.app.get('io'));
    res.send(cb);
  }catch(e){RES_ERROR(res,e)}
})

router.post('/clear', auth, async(req,res) => {
  try {
    let cb = await ctrl.clearList(req.user, req.list, req.app.get('io'));
    res.send(cb);
  }catch(e){RES_ERROR(res,e)}
})

router.get('/shares', async (req, res) => {
  let cb = await ctrl.getListShares(req.list_id);
  res.send(cb);
})

router.get('/bestShoppingCart', async (req,res) => {
  let cb = await ctrl.getBestShoppingCart(req.list_id);
  res.send(cb);
})

module.exports = router;
