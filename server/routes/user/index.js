const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../controller/user');
const {RES_ERROR}       =   require('../../config');
const passport          =   require('passport');
const auth              =   require('../../middleware/auth');


router.post('/login/google', (req, res) => {
  passport.authenticate('googleID', (err, user) => {
    if(err)
      return res.status(500).send(err);
    if(!user)
      return res.status(500).send('Credentials Inavlid');

    req.login(user, (err) => {
      return res.send(user);
    })
  })(req, res);
});

router.post('/logout', auth, (req,res) => {
  const user_id = req.user.user_id;
  req.session.destroy();
  req.logout();  
  res.send(`goodbye`);
})

router.post('/auth-test', auth, (req,res) => {
  res.send(req.user);
})


module.exports = router;
