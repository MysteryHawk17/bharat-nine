const templeDB=require("../models/templeModel")
const asynchandler=require("express-async-handler");
const response=require('../middlewares/responseMiddleware');

const test=asynchandler((req,res)=>{
    response.successResponst(res,'','Temple route established')
})

const createTemple=asynchandler(async(req,res)=>{
    const{name,location,availableTimings}=req.body;
    if(!name||!location){
        response.validationError(res,"Fill in the details properly");
        return;
    }
    const newTemple=new templeDB({
        name:name,
        location:location,
        availableTimings:availableTimings
    })

    const savedTemple=await newTemple.save();
    if(savedTemple){
        response.successResponst(res,savedTemple,"Successfully saved the temple");
    }
    else{
        response.internalServerError(res,"Error in saving the temple");
    }
})

const getAllTemple=asynchandler(async(req,res)=>{
    const temples=await templeDB.find({});
    if(temples){
        response.successResponst(res,temples,"Successfully fetched the temple");
    }
    else{
        response.internalServerError(res,"Error in fetching the temples");
    }
})
const getSingleTemple=asynchandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        response.validationError(res,"Invalid parameter");
        return;
    }
    else{
        const findTemple=await templeDB.findById({_id:id}).populate('bookingData');
        if(findTemple){
            response.successResponst(res,findTemple,"Successfully fetched the temple");
        }
        else{
            response.notFoundError(res,'Temple not found');
        }
    }
})
const deleteTemple=asynchandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        response.validationError(res,"Invalid parameter");
    }
    else{
        const findTemple=await templeDB.findById({_id:id});
        if(findTemple){
            const deletedTemple=await templeDB.findByIdAndDelete({_id:id});
            if(deletedTemple){
                response.successResponst(res,deletedTemple,"Successfully deleted the temple");

            }
            else{
                response.internalServerError(res,"Failed to delete the temple");
            }
        }
        else{
            response.notFoundError(res,'Temple not found');
        }
    }
})
const updateTemple=asynchandler(async(req,res)=>{
    const {id}=req.params;
    if(!id){
        response.validationError(res,"Invalid parameter");
    }
    else{
        const findTemple=await templeDB.findById({_id:id});
        if(findTemple){
            const{name,location,availableTimings}=req.body;
            const updateData={};
            if(name){
                updateData.name=name;
            }
            if(location){
                updateData.location=location;
            }
            if(availableTimings){
                updateData.availableTimings=availableTimings;
            }
            const updatedTemple=await templeDB.findByIdAndUpdate({_id:id},updateData,{new:true});

            if(updatedTemple){
                response.successResponst(res,updatedTemple,"Successfully Updated  the temple");

            }
            else{
                response.internalServerError(res,"Failed to update the temple");
            }
        }
        else{
            response.notFoundError(res,'Temple not found');
        }
    }
})

module.exports={test,createTemple,getAllTemple,getSingleTemple,deleteTemple,updateTemple};