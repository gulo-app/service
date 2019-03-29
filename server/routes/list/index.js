const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');

router.use('/product', require('./product'));

//get all lists by userId
router.get('/', auth, async (req,res) => {
  try {
    let lists = await ctrl.getAllLists(req.user);
    res.send(lists);
  }
  catch(e){
    RES_ERROR(res,e);
  }
})

//create new list {title: '', user_id: '', shares: [11,33..etc]}
router.post('/', auth, async (req,res) => {
  let newList = _.pick(req.body, ['title', 'shares']);
  try{
    let cb = await ctrl.addList(req.user, newList);
    res.send(cb);
  }catch(e){
    RES_ERROR(res, e);
  }
}) 


//get list id (all products in list)
router.get('/:listid', auth, async (req,res) => {
  let {list_id} = req.params;
  let {user_id} = req.user;
  try {
      let list_products = await ctrl.getListProducts(user_id, list_id);
      res.send(list_products);
  }catch(e) {
      RES_ERROR(res, e);
  }
})


//update specific list by id
router.put('/:listid', auth, async (req,res) => {
  let {title}   = req.body;
  let {list_id} = req.params;
  let {user_id} = req.user;
  console.log(user_id);
  console.log(list_id);
  console.log(title);
  try {
    let cb = await ctrl.updateList(user_id, list_id, title);
    res.send(cb);
  }catch(e){
    RES_ERROR(res,e);
  }
})


// delete list by id
router.delete('/:listid', auth, async (req,res) => {
  let {list_id} = req.params;
  let {user_id} = req.user;
  try {
    let cb = await ctrl.deleteList(user_id, list_id);
    res.send();
  }catch(e){
    RES_ERROR(res,e);
  }
})

//share a list with user_id
router.put('/:listid/share', auth, async (req,res) => {
  let {shares}  = req.body; //[user_id, user_id, ...]
  let {user_id} = req.user;
  let {list_id} = req.params;
  try {
    let cb = await ctrl.shareList(user_id, list_id, shares);
    res.send(cb);
  }catch(e){
    RES_ERROR(res,e);
  }
})

module.exports = router;
