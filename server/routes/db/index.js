const router            =   require('express').Router();
const initializeDB      =   require('../../controller/db/initialize');

router.use('/crawler',require('./crawler'));

router.get('/initialize', async (req,res) => {
  try{
    await initializeDB();
    res.send('Gulo database created successfully');
  }catch(e){
    console.log(e);
    return res.status(400).send(e);
  }
})

module.exports = router;
