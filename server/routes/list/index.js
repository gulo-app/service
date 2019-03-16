const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');

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


//update specific list by id 
router.put('/:id', auth, async (req,res) => {
  let list = _.pick(req.body,['title','list_id']);

  try {
    let cb = await ctrl.updateList(list.list_id, list.title);
    res.send(cb);
  }catch(e){
    RES_ERROR(res,e);
  }
})

// delete list by id
router.delete('/:id', auth, async (req,res) => {
  let listToDelete = _.pick(req.body, ['list_id']);
  
  try {
    let cb = await ctrl.deleteList(req.user, listToDelete.list_id);
    //TODO: get all lists of user after the delete??
    res.send(true);
  }catch(e){
    RES_ERROR(res,e);
  }
})


//share a list with user_id 
router.put('/share', auth, async (req,res) => {
  let share = _.pick(req.body,['user_mail','list_id']);

  try {
    let cb = await ctrl.shareList(share.list_id, share.user_mail);
    res.send(cb);
  }catch(e){
    RES_ERROR(res,e);
  }
})


module.exports = router;
