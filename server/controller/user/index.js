const conn            =   require('../../db/connection');
const {ParamsError}   =   require('../../config/errors');
const generatePassword    =   require('generate-password');

const getUserByID = async (user_id) => {
  let users = await conn.sql(`SELECT * FROM users WHERE user_id=${user_id}`);
  if(users.length===0) return null;
  let user = users[0];

  // delete user.facebookID;
  // delete user.googleID;
  return user;
}

const getUserByMail = async (mail) => {
  let users = await conn.sql(`SELECT user_id, mail FROM users WHERE mail='${mail}'`);
  if(users.length===0) return null;
  let user = users[0];

  return await getUserByID(user.user_id);
}

const getUserByAuthToken = async (authToken, mail) => {
  let users = await conn.sql(`SELECT user_id, mail,authToken FROM users WHERE mail='${mail}' AND authToken='${authToken}'`);
  if(users.length===0) return null;
  let user = users[0];

  let db_user = await getUserByID(user.user_id);
  delete db_user.authToken;
  return db_user;
}

const register = async (user) => {
  let names = user.name.split(' ');
  user.authToken = await createAuthToken(user);
  let cb = await conn.sql(`
            INSERT INTO users
              (mail, firstname, lastname, pic, authToken)
            VALUES
              ('${user.email}', '${names[0]}','${names[1]}','${user.picture}', "${user.authToken}")
          `);
  let users = await conn.sql(`SELECT * FROM users WHERE mail='${user.email}'`);
  return users[0];
}

const setAuthToken = async (user) => {
  if(!user || !user.authToken)
    throw Error('setAuthToken failed');

  await conn.sql(`UPDATE users SET authToken='${user.authToken}' WHERE mail='${user.email}'`);
}

const setProfilePic = async (user, newPic) => {
  await conn.sql(`UPDATE users SET pic='${newPic}' WHERE user_id=${user.user_id}`);
  user.pic = newPic;
}

const getAllUsersButMe = async (myUserID) => {
  let sql = `SELECT user_id, mail, CONCAT(firstname, ' ', lastname) AS fullname, pic FROM users WHERE user_id<>${myUserID}`;
  return await conn.sql(sql);
}

const createAuthToken = async () => {
  const authToken = generatePassword.generate({
      length: 20,
      numbers: true
  });
  return authToken;
}

module.exports = {
  register,
  getUserByID,
  getUserByMail,
  getUserByAuthToken,
  setProfilePic,
  getAllUsersButMe,
  setAuthToken
}
