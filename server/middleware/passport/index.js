const passport            =     require('passport');
const CustomStrategy      =     require('passport-custom').Strategy;
const googleVerifier      =     require('google-id-token-verifier');
const axios               =     require('axios');
const _                   =     require('lodash');
const ctrlUser            =     require('../../controller/user');
const conn                =     require('../../db/connection');
const fbAdmin             =     require('../../firebase');

module.exports = () => {
  passport.use('firebase', new CustomStrategy(async function(req, done) {
      console.log(`test`);
      let {idToken, email} = req.body;
      console.log(req.body);
      if(!idToken)
        return done('idToken is missing', null);
      console.log(idToken);
      const user = await verifyGoogleTokenByFirebaseAdmin(idToken);
      if(!user || !user.email)
        return done('idToken is missing', null);

      let isExists = await conn.sql(`SELECT * FROM users WHERE mail='${user.email}'`);
      if(isExists.length===0)
        await ctrlUser.register(user);

      let db_user = await ctrlUser.getUserByMail(user.email);

      if(db_user.pic!==user.picture)
        await ctrlUser.setProfilePic(db_user, user.picture);

      done(null, db_user);
    }
  ));

  passport.use('byAuthToken', new CustomStrategy(async function(req, done) {
      let {authToken, mail} = req.body;
      const db_user = await ctrlUser.getUserByAuthToken(authToken, mail);

      if(!db_user || !db_user.mail)
        return done('AuthToken Credentials Error', null);

      return done(null, db_user);
    }
  ));

  passport.serializeUser((user, done) => {  //trigger on req.login()
    done(null, user.mail); //write user_id into current session file
  });

  passport.deserializeUser(async (user_mail, done) => {
    let user = await ctrlUser.getUserByMail(user_mail);
    done(null, user); //push user details into req.user
  });
}

const verifyGoogleTokenByFirebaseAdmin = async (idToken) => {
  return new Promise((resolve,reject) => {
    fbAdmin.auth().verifyIdToken(idToken).then(function(cb) {
        resolve(cb);
      }).catch(function(error) {
        reolsve(null);
      })
  })
};
