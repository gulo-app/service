const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const auth       =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');

router.get('/', (req,res) => {
  res.send("index list");
})

router.post('/', auth, async (req,res) => { //create new list {title: '', user_id: '', shares: [11,33..etc]}
  let newList = _.pick(req.body, ['title', 'shares']);
  try{
    let cb = await ctrl.addList(req.user, newList);
    res.send(cb);
  }catch(e){
    RES_ERROR(res, e);
  }
})

module.exports = router;
