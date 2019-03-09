const express = require('express')
const router = express.Router();

router.use('/db',  require('./db'));
router.use('/list',  require('./list'));
router.use('/user',  require('./user'));

router.get('/', (req, res) => {
    res.send("this is index baby");
});

router.all('*', (req, res) => {
  res.status(404).send();
})

module.exports = router;
