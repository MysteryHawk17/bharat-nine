const mongoose=require("mongoose");

const templeSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availableTimings:[{
        date:{
            type:String
        },
        time:{
            type:String
        }
    }]
})

const templeModel=mongoose.model("Temple",templeSchema);


module.exports=templeModel;