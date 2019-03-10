const passport            =     require('passport');
const UniqueTokenStrategy =     require('passport-unique-token').Strategy;
const GoogleStrategy      =     require('passport-google-oauth20').Strategy;
const CustomStrategy      =     require('passport-custom').Strategy;
const _                   =     require('lodash');
const conn                =     require('../../db/connection');

module.exports = () => {
  passport.use('googleID', new CustomStrategy(async function(req, done) {
      const profile     =   req.body;
      const {googleId}  =   profile;
      if(!googleId)
        return done('googleID is missing', null);

      let isExists = await conn.sql(`SELECT * FROM users WHERE googleID='${googleId}'`);
      if(isExists.length===0)
        await GoogleRegister(profile);

      let user = await getUser(profile.email);

      if(user.pic!==profile.imageUrl)
        await setProfilePic(user, profile.imageUrl);

      done(null, user);
    }
  ));

  passport.use('facebookID', new CustomStrategy(async function(req, done) {
      const profile     =   req.body;
      const facebookId  =   req.body.id;
      if(!facebookId)
        return done('facebookID is missing', null);

      let isExists = await conn.sql(`SELECT user_id FROM users WHERE facebookID='${facebookId}'`);
      if(isExists.length===0)
        await FacebookRegister(profile);

      let user = await getUser(profile.email);

      if(user.pic!==profile.picture.data.url)
        await setProfilePic(user, profile.picture.data.url);

      done(null, user);
    }
  ));

  passport.serializeUser((user, done) => {  //trigger on req.login()
    done(null, user.user_id); //write user_id into current session file
  });
  passport.deserializeUser(async (user_id, done) => {
    let users = await conn.sql(`SELECT * FROM users WHERE user_id=${user_id}`); //get the user_id from session file
    let user  = users[0] ? users[0] : null;
    done(null, user); //push user details into req.user
  });
}



const GoogleRegister = async (profile) => {
  let cb = await conn.sql(`
            INSERT INTO users
              (mail, googleID, firstname, lastname, pic)
            VALUES
              ('${profile.email}','${profile.googleId}','${profile.givenName}','${profile.familyName}','${profile.imageUrl}')
            ON DUPLICATE KEY UPDATE
              googleID = '${profile.googleId}'
          `);
  let users = await conn.sql(`SELECT * FROM users WHERE googleID='${profile.googleId}'`);
  return users[0];
}

const FacebookRegister = async (profile) => {
  let fullname = profile.name.split(' ');
  let cb = await conn.sql(`
            INSERT INTO users
              (mail, facebookID, firstname, lastname, pic)
            VALUES
              ('${profile.email}','${profile.id}','${fullname[0]}','${fullname[1]}','${profile.picture.data.url}')
            ON DUPLICATE KEY UPDATE
                facebookID = '${profile.id}'
          `);
  let users = await conn.sql(`SELECT * FROM users WHERE facebookID='${profile.id}'`);
  return users[0];
}

const setProfilePic = async (user, newPic) => {
  await conn.sql(`UPDATE users SET pic='${newPic}' WHERE user_id=${user.user_id}`);
  user.pic = newPic;
}

const getUser = async (mail) => {
  let users = await conn.sql(`SELECT * FROM users WHERE mail='${mail}'`);
  if(users.length===0) return null;
  let user = users[0];

  delete user.facebookID;
  delete user.googleID;
  return user;
}
