const quoteDB=require("../models/quote");
const asynchandler=require("express-async-handler");
const response=require("../middlewares/responseMiddleware");
const createQuote=asynchandler(async(req,res)=>{
    const {quote}=req.body;
    if(!quote){
        response.validationError(res,"Invalid input. Please enter the details properly");
        return;
    }
    const newQuote=await quoteDB.create({
        quote:quote
    })
    if(newQuote){
        response.successResponst(res,newQuote,"Successfully created quote");
    }
    else{
        response.internalServerError(res,"Error in creating new quote");
    }
})
const getAllQuote=asynchandler(async(req,res)=>{
    const quotes=await quoteDB.find({});
    if(quotes){
        response.successResponst(res,quotes,"Successfully fetched the quotes");
    }
    else{
        response.internalServerError(res,"Error in fetching the quotes");
    }
})

const updateQuote=asynchandler(async(req,res)=>{
    const id=req.params.id;
    const findQuote=await quoteDB.findById({_id:id});
    if(findQuote){
        const updateData=req.body.quote;
        if(!updateData){
            response.validationError(res,"Please provide the proper details");
            return;
        }
        const updatedQuote=await quoteDB.findByIdAndUpdate({
            _id:id
        },{
            quote:updateData
        },{new:true});
        if(updatedQuote){
            response.successResponst(res,updatedQuote,"Successfully updated the quote");
        }
        else{
            response.internalServerError(res,"Failed to update the quote");
        }
    }
    else{
        response.notFoundError(res,"Quote not found");
    }
})

const deleteQuote=asynchandler(async(req,res)=>{
    const id=req.params.id;
    const findQuote=await quoteDB.findById({_id:id});
    if(findQuote){
        const deletedQuote=await quoteDB.findByIdAndDelete({
            _id:id
        });
        if(deletedQuote){
            response.successResponst(res,deletedQuote,"Successfully deleted the quote");
        }
        else{
            response.internalServerError(res,"Failed to delete the quote");
        }
    }
    else{
        response.notFoundError(res,"Quote not found");
    }
})
module.exports={createQuote,getAllQuote,updateQuote,deleteQuote};