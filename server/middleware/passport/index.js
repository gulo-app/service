const passport            =     require('passport');
const CustomStrategy      =     require('passport-custom').Strategy;
const googleVerifier      =     require('google-id-token-verifier');
const axios               =     require('axios');
const _                   =     require('lodash');
const ctrlUser            =     require('../../controller/user');
const conn                =     require('../../db/connection');
const fbAdmin             =     require('../../firebase');

module.exports = () => {
  passport.use('login', new CustomStrategy(async function(req, done) {
      let {idToken, provider} = req.body;
      if(!idToken || !provider)
        return done('params are missing', null);

      const verifyToken = getVerifyFunc(provider);
      const user = await verifyToken(idToken);

      if(!user || !user.email)
        return done('verification failed!', null);

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

const getVerifyFunc = (provider) => {
  switch(provider){
    case 'firebase':
      return verifyFirebaseToken;
    case 'google':
      return verifyGoogleToken;
    case 'facebook':
      return verifyFacebookToken;
  }
}

const verifyFacebookToken = async (tokenId) => {
  //console.log(`facebook verify`);
  return new Promise((resolve, reject) => {
      const url = `https://graph.facebook.com/me?access_token=${tokenId}&fields=name,email,picture`;
      axios.get(url).then(({data}) => {
        if(!data)
          return resolve(false);

        resolve({email: data.email, name: data.name, picture: data.picture.data.url});
      }).catch((e) => {
        //console.log('failed cb');
        return resolve(false);
      })
  })
}

const verifyGoogleToken = async (tokenId) => {
  //console.log(`google verify`);
  return new Promise((resolve, reject) => {
    googleVerifier.verify(tokenId, '180978526897-pa56t6sljm8hb1td5be3o2jdhopqbdj4.apps.googleusercontent.com', function (err, res) {
      if(err){
        console.log(err.message);
        return resolve(null);
      }
      resolve({email: res.email, name: res.name, picture: res.picture});
    });
  })
}

const verifyFirebaseToken = async (idToken) => {
  //console.log(`firebase verify`);
  return new Promise((resolve,reject) => {
    fbAdmin.auth().verifyIdToken(idToken).then(function(res) {
        resolve({email: res.email, name: res.name, picture: res.picture});
      }).catch(function(error) {
        console.log(error.message);
        resolve(null);
      })
  })
};
