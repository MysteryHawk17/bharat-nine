const { createQuote, getAllQuote, updateQuote, deleteQuote } = require("../controllers/quoteDataController");
const {checkAdmin}=require("../middlewares/authMiddleware");
const router=require("express").Router();



router.post("/create",checkAdmin,createQuote);
router.get("/getallquotes",getAllQuote);
router.put("/updatequote/:id",checkAdmin,updateQuote);
router.delete("/deletequote/:id",checkAdmin,deleteQuote);

module.exports=router;