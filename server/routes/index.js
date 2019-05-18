const express = require('express')
const router = express.Router();

router.use('/db',             require('./db'));
router.use('/list',           require('./list'));
router.use('/user',           require('./user'));
router.use('/notification',   require('./notification'));
router.use('/device',         require('./device'));

router.get('/', (req, res) => {
    //let io = req.app.get('socket');
    //console.log(socket.id);
    res.send("this is index baby");
});

router.all('*', (req, res) => {
  res.status(404).send();
})

module.exports = router;
