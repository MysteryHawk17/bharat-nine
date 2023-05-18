const mongoose=require("mongoose")

const quoteSchema=mongoose.Schema({
    quote:{
        type:String,
        required:true
    }
},{timestamps:true});


const quoteModel= mongoose.model("Quote",quoteSchema);

module.exports=quoteModel;