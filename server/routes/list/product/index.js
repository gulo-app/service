const router            =   require('express').Router();
const ctrl              =   require('../../../controller/product');
const _                 =   require('lodash');
const auth              =   require('../../../middleware/auth');
const {RES_ERROR}       =   require('../../../config');

/**
 * TODO:
 * get product details
 * change amount of product
 * toggle product (check v)
 * delete product from list
 * empty all list (put in list api)
 * edit product?
 * 
 */

router.get('/:productid', auth, async (req,res) =>{
    let {product_id} = req.params;
    
    try{
        let product = await getProduct(product_id);
        res.send(product);
    }catch(e){
        RES_ERROR(res,e);
    }
}) 

// Add product to list menualy from app
 router.post('/', auth, async (req,res) => {
     let {listid} = req.params;
     let {user_id} = req.user;
     let {barcode} = req.body;
     let {quantity} = req.body;

     try {
        let result = await ctrl.addProduct(user_id, listid, barcode, quantity);
        if(!result) {
            //REDIRECT to add new product to database route;
            //for now:
            return false;
        }

        res.send(result);
      }catch(e){
        RES_ERROR(res,e);
      }
 })

module.exports = router;
