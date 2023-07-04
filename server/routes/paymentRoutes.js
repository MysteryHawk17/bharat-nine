const { handlePayment } = require("../controllers/paymentController");

const router=require("express").Router();




router.post("/generatepaymentlink",handlePayment);


module.exports=router;