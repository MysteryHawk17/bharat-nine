const { test, getCartDetails, addToCart, getPrasadHistory, prasadCheckout } = require("../controllers/prasadCheckoutController")

const router=require("express").Router()



router.get("/test",test);
router.get("/getcart/:cartId",getCartDetails);
router.post("/updatecart/:cartId",addToCart);
router.get("/prasadhistory/:id",getPrasadHistory);
router.post("/createhistory/prasad/:id",prasadCheckout);


module.exports=router;