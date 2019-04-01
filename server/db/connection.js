const mysql = require('mysql');
const conn  = mysql.createPool({
  host: '35.226.42.229', //process.env.isProd ? '35.226.42.229' : 'localhost',
  user: "gulo",
  password: "shenkar",
  database: "gulo",
  connectionLimit: 1,
  supportBigNumbers: true,
  multipleStatements: true
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
