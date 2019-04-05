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

//share a list with user_id
router.put('/:list_id/share', auth, async (req,res) => {
  let {shares}  = req.body; //[user_id, user_id, ...]
  let {user_id} = req.user;
  let {list_id} = req.params;
  try {
    let cb = await ctrl.shareList(user_id, list_id, shares);
    res.send(cb);
  }catch(e){RES_ERROR(res,e)}
})


router.get('/shares', async (req, res) => {
  let cb = await ctrl.getListShares(req.list_id);
  res.send(cb);
})

module.exports = router;
