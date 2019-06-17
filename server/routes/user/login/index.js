const router            =   require('express').Router();
const _                 =   require('lodash');
const ctrl              =   require('../../../controller/user');
const passport          =   require('passport');
const auth              =   require('../../../middleware/auth');
const {RES_ERROR}       =   require('../../../config');

router.post('/firebase', (req, res) => {
  passport.authenticate('firebase', (err, user) => {
    if(err)
      return res.status(500).send(err);
    if(!user)
      return res.status(500).send('Credentials Inavlid');

    req.login(user, (err) => {
      return res.send(user);
    })
  })(req, res);
});

router.post('/byAuthToken', (req, res) => {
  passport.authenticate('byAuthToken', (err, user) => {
    if(err)
      return res.status(500).send(err);
    if(!user)
      return res.status(500).send('Credentials Inavlid');

    req.login(user, (err) => {
      return res.send(user);
    })
  })(req, res);
});


// router.post('/google', (req, res) => {
//   passport.authenticate('googleID', (err, user) => {
//     if(err)
//       return res.status(500).send(err);
//     if(!user)
//       return res.status(500).send('Credentials Inavlid');
//
//     req.login(user, (err) => {
//       return res.send(user);
//     })
//   })(req, res);
// });
//
// router.post('/facebook', (req, res) => {
//   try{
//     passport.authenticate('facebookID', (err, user) => {
//       if(err)
//         return res.status(500).send(err);
//       if(!user)
//         return res.status(500).send('Credentials Inavlid');
//
//       req.login(user, (err) => {
//         return res.send(user);
//       })
//     })(req, res);
//   }catch(e){RES_ERROR(res, e)};
// });

router.post('/auth-test', auth, (req,res) => {
  res.send(req.user);
})


module.exports = router;
