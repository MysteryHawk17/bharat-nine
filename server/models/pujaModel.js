const mongoose=require("mongoose")


const pujaSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
   description:{
        type:String
    },
    temple:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Temple"
        }
    ],
    image:{
        type:String,
        required:true
    },
    based:{
        type:String,
        enum:['GOD-GODESSES','OCASSION','INDIVIDUAL'],
        
    }
})

const pujaModel=mongoose.model("Puja",pujaSchema)
module.exports=pujaModel;