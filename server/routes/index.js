const express = require('express')
const router = express.Router();

router.use('/db',  require('./db'));

router.all('*', (req, res) => {
  res.status(404).send();
})

module.exports = router;
