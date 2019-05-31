const router            =   require('express').Router();
const initializeDB      =   require('../../controller/db/initialize');
const getterDB          =   require('../../controller/db/getter');
const auth              =   require('../../middleware/auth');
const {RES_ERROR}       =   require('../../config');

router.get('/initialize', async (req,res) => {
  try{
    let {pass, isFill} = req.query; //<isFill> is flag which would fill the products table from the crawler output automatically after db initializition
    let cb = await initializeDB(pass, isFill);
    res.send('Gulo database created successfully');
  }catch(e){
    RES_ERROR(res, e);
  }
});

router.get('/categories', auth, async (req,res) => {
    res.send(await getterDB.categories());
})

router.get('/brands', auth, async (req,res) => {
    res.send(await getterDB.brands());
})

router.get('/capacity_units', auth, async (req,res) => {
    res.send(await getterDB.capacity_units());
})

module.exports = router;
