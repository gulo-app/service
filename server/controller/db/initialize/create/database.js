const conn    =     require('../../../../db/connection');

module.exports = async () => {
  await conn.sql('CREATE DATABASE IF NOT EXISTS gulo');
  await conn.sql('USE gulo');
  return;
}
