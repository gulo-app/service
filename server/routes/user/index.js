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



module.exports = router;
