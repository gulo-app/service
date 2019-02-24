const mysql = require('mysql');
const conn  = mysql.createPool({
  host: "localhost",
  user: "gulo",
  password: "shenkar",
  connectionLimit: 1,
  supportBigNumbers: true
});

conn.sql = async (sql) => {
  return new Promise((resolve,reject) => {
    conn.query(sql, (err, cb) => {
      if(err){
        //console.log(err);
        reject(err);
      }
      resolve(cb);
    })
  })
}

module.exports = conn;
