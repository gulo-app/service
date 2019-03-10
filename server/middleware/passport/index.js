const passport            =     require('passport');
const UniqueTokenStrategy =     require('passport-unique-token').Strategy;
const GoogleStrategy      =     require('passport-google-oauth20').Strategy;
const CustomStrategy      =     require('passport-custom').Strategy;
const _                   =     require('lodash');
const conn                =     require('../../db/connection');

module.exports = () => {
  const users = [
    {id: 1111, token: '1234abcd'}, {id: 2222, token: 'xyz789'}, {id: 3333, token: 'fhfdas'}
  ]

  passport.use('googleID', new CustomStrategy(async function(req, done) {
      const profile     =   req.body;
      const {googleId}  =   profile;
      if(!googleId)
        return done('googleID is missing', null);

      let users = await conn.sql(`SELECT * FROM users WHERE googleID='${googleId}'`);
      let user;

      if(users.length===0)
        user = await GoogleRegister(profile);
      else
        user = users[0];

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

  const GoogleRegister = async (profile) => {
    let cb = await conn.sql(`
              INSERT INTO users
                (mail, googleID, firstname, lastname, pic)
              VALUES
                ('${profile.email}','${profile.googleId}','${profile.givenName}','${profile.familyName}','${profile.imageUrl}')
            `);
    let users = await conn.sql(`SELECT * FROM users WHERE googleID='${profile.googleId}'`);
    return users[0];
  }

}
