const router            =   require('express').Router();
const initializeDB      =   require('../../controller/db/initialize');
const {RES_ERROR}       =   require('../../config');

router.get('/initialize', async (req,res) => {
  try{
    let {pass, isFill} = req.query; //<isFill> is flag which would fill the products table from the crawler output automatically after db initializition
    let cb = await initializeDB(pass, isFill);
    res.send('Gulo database created successfully');
  }catch(e){
    RES_ERROR(res, e);
  }
})

module.exports = router;
