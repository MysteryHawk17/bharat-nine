const { addBanner, deleteBanner } = require("../controllers/bannerController");

const router=require("express").Router();



router.post("/create",addBanner);
router.delete("/delete/:id",deleteBanner);


module.exports=router;