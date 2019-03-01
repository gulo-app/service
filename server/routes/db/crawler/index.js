const router            =   require('express').Router();
const crawler           =   require('../../../controller/db/crawler');

router.get('/', async (req,res) => {
  try{
    let cb = await crawler.ramiLevy();
    res.send(cb);
  }catch(e){
    console.log(e);
    res.status(500).send();
  }
})
module.exports = router;
