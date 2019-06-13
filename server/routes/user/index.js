const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../controller/user');
const {RES_ERROR}       =   require('../../config');
const auth              =   require('../../middleware/auth');

router.use('/login',require('./login'))

router.post('/logout', auth, (req,res) => {
  const user_id = req.user.user_id;
  req.session.destroy();
  req.logout();
  res.send(`goodbye`);
})

router.post('/test', (req,res) => {
  let {data} = req.body;
  res.send({data});
})

router.use('/getAllUsersButMe', auth, async (req,res) => {
  try{
    let users = await ctrl.getAllUsersButMe(req.user.user_id);
    res.send(users);
  }catch(e){RES_ERROR(res, e)};
})

module.exports = router;
