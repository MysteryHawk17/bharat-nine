const { test, addOnlineHistory, addOfflineHistory, updateStatus, getAllBookings, getAbooking, getUserBookings, updatePaymentDetails } = require("../controllers/pujaCheckoutControllers");

const router=require("express").Router();
const {checkLogin}=require("../middlewares/authMiddleware")


router.get("/test",test);
router.post("/create/online",checkLogin,addOnlineHistory);
router.post("/create/offline",checkLogin,addOfflineHistory);
router.patch("/update/:id",updateStatus);
router.get("/getallbookings",getAllBookings);
router.get("/getabooking/:id",getAbooking);
router.get("/getuserbookings",checkLogin,getUserBookings)
router.put("/updatepaymentdetails/:id",updatePaymentDetails);

module.exports=router;