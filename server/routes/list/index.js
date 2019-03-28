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


module.exports = router;
