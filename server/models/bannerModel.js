const mongoose=require("mongoose")


const bannerSchema=mongoose.Schema({
    image:{
        type:String,
        required:true
    }
})

const bannerModel=mongoose.model("Banner",bannerSchema);
module.exports=bannerModel;