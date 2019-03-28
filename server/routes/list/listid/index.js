const router            =   require('express').Router();
const ctrl              =   require('../../../controller/list');
const _                 =   require('lodash');
const auth              =   require('../../../middleware/auth');
const {RES_ERROR}       =   require('../../../config');


//get list id (all products in list)
router.get('/', auth, async (req,res) => {
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
router.put('/', auth, async (req,res) => {
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
router.delete('/', auth, async (req,res) => {
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
router.put('/share', auth, async (req,res) => {
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

