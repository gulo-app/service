const conn            =   require('../../db/connection');
const {ParamsError}   =   require('../../config/errors');

const getUserByMail = async (mail) => {
  let users = await conn.sql(`SELECT * FROM users WHERE mail='${mail}'`);
  if(users.length===0) return null;
  let user = users[0];

  delete user.facebookID;
  delete user.googleID;
  return user;
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
  console.log(profile.name);
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

const register = async (user) => {
  if(Object.keys(user).length<4)
    throw new ParamsError('Registration failed: firstname || lastname || email are missing.');

  let cb = await conn.sql(`INSERT INTO users
                    (mail, googleToken, firstname, lastname)
                      VALUES
                    ('${user.mail}','${user.googleToken}','${user.firstname}','${user.lastname}')
                `);

}

const getAllUsersButMe = async (myUserID) => {
  let sql = `SELECT user_id, mail, CONCAT(firstname, ' ', lastname) AS fullname, pic FROM users WHERE user_id<>${myUserID}`;
  return await conn.sql(sql);
}

module.exports = {
  register,
  getUserByMail,
  GoogleRegister,
  FacebookRegister,
  setProfilePic,
  getAllUsersButMe
}
