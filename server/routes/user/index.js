const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../controller/user');
const {RES_ERROR}       =   require('../../config');

router.get('/', (req,res) => {
  res.send("index user");
})

router.post('/register', async (req,res) => {
  let user = _.pick(req.body, ['mail', 'googleToken', 'firstname','lastname']);
  try{
    let cb = await ctrl.register(user);
    res.send(cb);
  }catch(e){
    RES_ERROR(res, e);
  }
})


module.exports = router;
