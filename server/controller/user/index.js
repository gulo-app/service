const conn            =   require('../../db/connection');
const {ParamsError}   =   require('../../config/errors');

const register = async (user) => {
  if(Object.keys(user).length<4)
    throw new ParamsError('Registration failed: firstname || lastname || email are missing.');

  let cb = await conn.sql(`INSERT INTO users
                    (mail, googleToken, firstname, lastname)
                      VALUES
                    ('${user.mail}','${user.googleToken}','${user.firstname}','${user.lastname}')
                `);

}

module.exports = {
  register
}
