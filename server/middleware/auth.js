const verifyUser = (req, res, next) => {
  console.log("verifyUser");
  next();
}

module.exports = {
  verifyUser
}
