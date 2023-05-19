const { test, addHistory, getHistory, getAllBookings } = require("../controllers/pujaHistoryController")
const{checkLogin,checkAdmin}=require("../middlewares/authMiddleware");
const router=require("express").Router()




router.get("/test",test)
router.post("/createhistory",checkLogin,addHistory);
router.get("/gethistory/:id",checkLogin,getHistory);
router.get("/getallbookings",checkAdmin,getAllBookings);


module.exports=router;