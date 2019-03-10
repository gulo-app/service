const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../controller/user');
const {RES_ERROR}       =   require('../../../config');
const passport          =   require('passport');

router.get('/', (req,res) => {
  res.send("index /user/login");
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/loginError' }), function(req, res) {
    res.send("authenticated");
});

router.get('/loginError', (req,res) =>{
  res.status(500).send("loginError");
})


module.exports = router;
