const { test, getCartDetails, addToCart, getPrasadHistory, prasadCheckout } = require("../controllers/prasadCheckoutController")

const router=require("express").Router()
const{checkLogin}=require("../middlewares/authMiddleware");


router.get("/test",test);
router.get("/getcart",checkLogin,getCartDetails);
router.post("/updatecart",checkLogin,addToCart);
router.get("/prasadhistory",checkLogin,getPrasadHistory);
router.post("/createhistory/prasad",checkLogin,prasadCheckout);


module.exports=router;