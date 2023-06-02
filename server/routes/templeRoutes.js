const { test, createTemple, getAllTemple, getAtemple, updateTemple, deleteTemple } = require("../controllers/templeController");

const router=require("express").Router();



router.get("/test",test);
router.post("/createtemple",createTemple);
router.get('/getalltemple',getAllTemple);
router.get("/gettemple/:id",getAtemple);
router.put("/updatetemple/:id",updateTemple);
router.delete("/deletetemple/:id",deleteTemple);


module.exports=router;