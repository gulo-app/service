const mysql = require('mysql');
const IS_PROD  =  process.env.IS_PROD;

const conn  = mysql.createPool({
  host: IS_PROD ? '35.205.128.46' : 'localhost', //process.env.isProd ? '35.226.42.229' : 'localhost',
  user: "gulo",
  password: "shenkar",
  database: "gulo",
  connectionLimit: 1,
  supportBigNumbers: true,
  multipleStatements: true
});

if(IS_PROD){
  console.log("running on remote mySQL");
}

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
