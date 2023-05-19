const router=require("express").Router()
const{test, addHistory, getHistory, getAllBookings}=require("../controllers/panditHistoryController");
const{checkLogin,checkAdmin}=require("../middlewares/authMiddleware");

router.get("/test",test);
router.post("/createhistory",checkLogin,addHistory);
router.get("/gethistory/:id",checkLogin,getHistory);
router.get("/getallbookings",checkAdmin,getAllBookings);



module.exports=router;
