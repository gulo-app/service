const RES_ERROR = (res, err) => {
  let status =  err.status || 500;
  let cb     =  err.isCB ? err.message : null;

  console.log(err.message);
  res.status(status).send(cb);
}

module.exports = RES_ERROR;
