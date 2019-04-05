const router            =   require('express').Router();
const ctrl              =   require('../../controller/list');
const _                 =   require('lodash');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');


/*      /list      */

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
    let newListCB = await ctrl.addList(req.user, newList, req.app.get('io'));
    res.send(newListCB);
  }catch(e){RES_ERROR(res, e)}
})

router.get('/types', auth, async (req,res) => {
  try{
    let listTypes = await ctrl.getTypes();
    res.send(listTypes);
  }catch(e){ RES_ERROR(res, e)};
})


module.exports = router;
