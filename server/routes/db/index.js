const router    =   require('express').Router();
const ctrl      =   require('../../controller/db/initialize');


router.get('/initialize', async (req,res) => {
  try{
    let cb = await ctrl.createDB();
    res.send(cb);
  }catch(e){
    console.log(e);
    return res.status(400).send(e);
  }
})

module.exports = router;
