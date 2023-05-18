const mongoose=require("mongoose")

const templeSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    bookingData:[{
        date:{
            type:Date
        },
        time:{
            type:String
        }
    }]
    
   
},{timestamps:true})

const templeModel=mongoose.model("Temple",templeSchema)
module.exports=templeModel;