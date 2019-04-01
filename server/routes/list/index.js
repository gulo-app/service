const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');


router.use('/:list_id(\\d+)/', (req,res,next) => {
  req.list_id = req.params.list_id;
  next();
}, require('./list_id'));


//get all lists by userId
router.get('/', auth, async (req,res) => {
  try {
    let lists = await ctrl.getAllLists(req.user);
    res.send(lists);
  }
  catch(e){RES_ERROR(res,e)}
})


//create new list {list_name, list_type, device_id, device_password, shares: []}
router.post('/', auth, async (req,res) => {
  let newList = _.pick(req.body, ['list_name', 'list_type', 'device_id', 'device_password', 'shares']);
  try{
    let cb = await ctrl.addList(req.user, newList);
    res.send(cb);
  }catch(e){RES_ERROR(res, e)}
})


//update specific list by id
router.put('/:list_id', auth, async (req,res) => {
  let {title}   = req.body;
  let {list_id} = req.params;
  let {user_id} = req.user;
  try {
    let cb = await ctrl.updateList(user_id, list_id, title);
    res.send(cb);
  }catch(e){RES_ERROR(res,e)}
})

// delete list by id
router.delete('/:list_id', auth, async (req,res) => {
  let {list_id} = req.params;
  try {
    let cb = await ctrl.deleteList(req.user.user_id, list_id);
    res.send();
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

router.get('/types', auth, async (req,res) => {
  try{
    let listTypes = await ctrl.getTypes();
    res.send(listTypes);
  }catch(e){ RES_ERROR(res, e)};
})


module.exports = router;
