const userDB = require("../models/userModel")
const prasadDB = require("../models/prasadModel")
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const shortid = require("shortid");
const cloudinary = require("../utils/cloudinary")
const shortidChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@";

const createPrasad = asynchandler(async (req, res) => {
    const { templeName, address, pincode, cost, description, howToReach, geoLat, geoLong, itemsIncluded,status,dateOfExp,specifications,qna } = req.body;
    console.log(req.body)
    if (!templeName || !address || !pincode || !cost || !description || !howToReach || !geoLat || !geoLong || !itemsIncluded || !req.file||!status||!dateOfExp||!specifications||!qna) {
        response.validationError(res, "Please fill in the details");
        return;
    }
    const location = [
        {
            address: address,
            pincode: pincode
        }
    ]
    const productId = shortid.generate(shortidChar);
    let displayURL = '';
    if (req.file) {
        const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
            folder: "Bharat One"
        })
        displayURL = uploadedImg.secure_url;
    }
    const items = itemsIncluded.split(',');

    const newPrasad = new prasadDB({
        templeName: templeName,
        location: location,
        cost: cost,
        itemsIncluded: items,
        displayImage: displayURL,
        description: description,
        howToReach: howToReach,
        geoLat: geoLat,
        geoLong: geoLong,
        productCode: productId,
        status:status,
        dateOfExp:dateOfExp,
        specifications:specifications,
        qna:JSON.parse(qna)
    })
    const savedPrasad = await newPrasad.save();
    if (savedPrasad) {
        response.successResponst(res, savedPrasad, "Prasad saved successfully.")
    }
    else {
        response.errorResponse(res, "Error in saving the new prasad", 400);
    }


})

const getAllPrasad = asynchandler(async (req, res) => {
    const prasads = await prasadDB.find();
    if (prasads) {
        response.successResponst(res, prasads, "Successfully fetched the prasads");
    }
    else {
        response.errorResponse(res, "Error in fetching the prasads", 400);
    }
})

const getPrasad = asynchandler(async (req, res) => {
    const id = req.params.id;
    const prasad = await prasadDB.findById({ _id: id });
    if (prasad) {
        response.successResponst(res, prasad, "Prasad fetched")
    }
    else {
        response.notFoundError(res, "Unable to fetch the prasad")
    }
})

const deletePrasad = asynchandler(async (req, res) => {
    const id = req.params.id;
    const prasad = await prasadDB.findById({ _id: id })
    if (prasad) {
        const deletedPrasad = await prasadDB.findByIdAndDelete({ _id: id });
        if (deletedPrasad) {
            response.successResponst(res, deletedPrasad, "Successfully deleted prasad");
        }
        else {
            response.internalServerError(res, "Internal server error");
        }
    }
    else {
        response.notFoundError(res, "Cannot found the specified prasad");
    }
})

const updatePrasad = asynchandler(async (req, res) => {
    const id = req.params.id;
    const prasad = await prasadDB.findById({ _id: id });
    if (prasad) {
        const { cost, templeName, description, status,dateOfExp ,address,pincode,specifications,qna} = req.body;
        const updatedOptions = {};
        if (cost) {
            updatedOptions.cost = cost;
        }
        if (templeName) {
            updatedOptions.templeName = templeName;
        }
        if (description) {
            updatedOptions.description = description;
        }
        if (dateOfExp) {
            updatedOptions.dateOfExp = dateOfExp;
        }
        if (status) {
            updatedOptions.status = status;
        }
        if(qna){
            updatedOptions.qna=JSON.parse(qna);
        }
        if(specifications){
            updatedOptions.specifications=specifications
        }
        if(req.file){
            const uploadedData=await cloudinary.uploader.upload(req.file.path,{
                folder:"Bharat One"
            })
            updatedOptions.displayImage=uploadedData.secure_url;
        }
        if(address||pincode){
            const location={
                address:address,
                pincode:pincode
            }
            updatedOptions.location=location;
        }
        const updatedPrasad = await prasadDB.findByIdAndUpdate({ _id: id }, updatedOptions, { new: true });
        if (updatedPrasad) {
            response.successResponst(res, updatedPrasad, "Successfully updated the prasad")
        }
        else {
            response.internalServerError(res, "Unable to update the prasad.")
        }
    }
    else {
        response.notFoundError(res, "Error in finding the prasad");
    }
})

module.exports = {  createPrasad, getAllPrasad, getPrasad, deletePrasad, updatePrasad };
