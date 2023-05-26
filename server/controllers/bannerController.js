const bannerDB = require("../models/bannerModel")
const asynchandler = require('express-async-handler')
const response = require("../middlewares/responseMiddleware");
const cloudinary = require("../utils/cloudinary")


const addBanner = asynchandler(async (req, res) => {
    if (!req.file) {
        response.validationError(res, "Please upload a image");
        return;
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const image = uploadedData.secure_url;
    const newBanner = new bannerDB({
        image: image
    })
    const savedBanner = await newBanner.save();
    if (savedBanner) {
        response.successResponst(res, savedBanner, "Banner uploaded successfully");
    }
    else {
        response.internalServerError(res, "Error in uploading image");
    }

})

const deleteBanner = asynchandler(async (req, res) => {
    const id=req.params.id;
    if(!id){
        response.validationError(res,"Please fill in the valid field");
    }
    const findBanner=await bannerDB.findById({_id:id});
    if(findBanner){
        const deletedBanner=await bannerDB.findByIdAndDelete({_id:id});
        if(deletedBanner){
            response.successResponst(res,deletedBanner,"Banner deleted successfully");
        }
        else{
            response.internalServerError(res,"failed to delete the banner successfully");
        }
    }   
    else{
        response.notFoundError(res,"Cannot find the banner");
    }
})

module.exports={addBanner,deleteBanner};