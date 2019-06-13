const passport            =     require('passport');
const CustomStrategy      =     require('passport-custom').Strategy;
const googleVerifier      =     require('google-id-token-verifier');
const axios               =     require('axios');
const _                   =     require('lodash');
const {GOOGLE_CID}        =     require('../../config');
const ctrlUser            =     require('../../controller/user');
const conn                =     require('../../db/connection');
const IS_PROD             =     process.env.IS_PROD;

module.exports = () => {
  passport.use('googleID', new CustomStrategy(async function(req, done) {
      let {idToken} = req.body;

      if(!idToken)
        return done('idToken is missing', null);

      const user = await verifyGoogleToken(idToken);
      if(!user)
        return done('idToken is missing', null);

      console.log(user);
      // if(IS_PROD && !isTokenValid) return done('tokenId is invalid', null);

      let isExists = await conn.sql(`SELECT * FROM users WHERE googleID='${user.sub}'`);
      if(isExists.length===0)
        await ctrlUser.GoogleRegister(user);

      let db_user = await ctrlUser.getUserByMail(user.email);

      if(db_user.pic!==user.picture)
        await ctrlUser.setProfilePic(db_user, user.picture);

      done(null, db_user);
    }
  ));

  passport.use('facebookID', new CustomStrategy(async function(req, done) {
      const profile     =   req.body;
      const facebookId  =   req.body.id;
      const tokenId     =   req.body.accessToken;

      if(!facebookId || !tokenId)
        return done('facebookID || token are missing', null);

      const isTokenValid = await verifyFacebookToken(tokenId);
      if(IS_PROD && !isTokenValid) return done('tokenId is invalid', null);

      let isExists = await conn.sql(`SELECT user_id FROM users WHERE facebookID='${facebookId}'`);
      if(isExists.length===0)
        await ctrlUser.FacebookRegister(profile);

      let user = await ctrlUser.getUserByMail(profile.email);

      if(user.pic!==profile.picture.data.url)
        await ctrlUser.setProfilePic(user, profile.picture.data.url);

      done(null, user);
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


const verifyGoogleToken = async (tokenId) => {
  return new Promise((resolve, reject) => {
    googleVerifier.verify(tokenId, GOOGLE_CID, function (err, tokenInfo) {
      if(err) return resolve(null);
      resolve(tokenInfo)
    });
  })
}

const verifyFacebookToken = async (tokenId) => {
  return new Promise((resolve, reject) => {
      const url = `https://graph.facebook.com/me?access_token=${tokenId}`;
      axios.get(url).then((res) => {
        if(res.data && res.data.id)
          return resolve(true);

        return resolve(false);
      }).catch((e) => {
        console.log('failed cb');
        return resolve(false);
      })
  })
}

/*

passport.use('googleID', new CustomStrategy(async function(req, done) {
    const profile     =   req.body;
    const {googleId, tokenId}  =   profile;

    if(!googleId || !tokenId)
      return done('googleID || token are missing', null);

    const isTokenValid = await verifyGoogleToken(tokenId);
    if(IS_PROD && !isTokenValid) return done('tokenId is invalid', null);

    let isExists = await conn.sql(`SELECT * FROM users WHERE googleID='${googleId}'`);
    if(isExists.length===0)
      await ctrlUser.GoogleRegister(profile);

    let user = await ctrlUser.getUserByMail(profile.email);

    if(user.pic!==profile.imageUrl)
      await ctrlUser.setProfilePic(user, profile.imageUrl);

    done(null, user);
  }
));

passport.use('facebookID', new CustomStrategy(async function(req, done) {
    const profile     =   req.body;
    const facebookId  =   req.body.id;
    const tokenId     =   req.body.accessToken;

    if(!facebookId || !tokenId)
      return done('facebookID || token are missing', null);

    const isTokenValid = await verifyFacebookToken(tokenId);
    if(IS_PROD && !isTokenValid) return done('tokenId is invalid', null);

    let isExists = await conn.sql(`SELECT user_id FROM users WHERE facebookID='${facebookId}'`);
    if(isExists.length===0)
      await ctrlUser.FacebookRegister(profile);

    let user = await ctrlUser.getUserByMail(profile.email);

    if(user.pic!==profile.picture.data.url)
      await ctrlUser.setProfilePic(user, profile.picture.data.url);

    done(null, user);
  }
));

*/
