const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const {RES_ERROR}       =   require('../../config');

router.get('/', (req,res) => {
  res.send("index list");
})

router.post('/', async (req,res) => { //create new list {title: '', user_id: '', shares: [11,33..etc]}
  let newList = _.pick(req.body, ['title', 'user_id', 'shares']);
  try{
    let cb = await ctrl.addList(newList);
    res.send(cb);
  }catch(e){
    RES_ERROR(res, e);
  }
})

module.exports = router;
