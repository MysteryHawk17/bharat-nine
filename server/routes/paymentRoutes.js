const { handlePayment, webhookUrl } = require("../controllers/paymentController");

const router=require("express").Router();




router.post("/generatepaymentlink",handlePayment);
router.post("/webhookurl",webhookUrl);

module.exports=router;