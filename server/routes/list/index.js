const router            =   require('express').Router();

router.get('/', (req,res) => {
  res.send("index list");
})

module.exports = router;
