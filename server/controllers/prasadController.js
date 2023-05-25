const userDB = require("../models/userModel")
const prasadDB = require("../models/prasadModel")
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const shortid = require("shortid");
const cloudinary = require("../utils/cloudinary")
const shortidChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@";

const createPrasad = asynchandler(async (req, res) => {
    const { templeName, address, pincode, cost, description, howToReach, geoLat, geoLong, itemsIncluded,status,dateOfExp } = req.body;
    if (!templeName || !address || !pincode || !cost || !description || !howToReach || !geoLat || !geoLong || !itemsIncluded || !req.file||!status||!dateOfExp) {
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
        dateOfExp:dateOfExp
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
        const { cost, howToReach, description, itemsIncluded,status } = req.body;
        const updatedOptions = {};
        if (cost) {
            updatedOptions.cost = cost;
        }
        if (howToReach) {
            updatedOptions.howToReach = howToReach;
        }
        if (description) {
            updatedOptions.description = description;
        }
        if (itemsIncluded) {
            updatedOptions.itemsIncluded = itemsIncluded;
        }
        if (status) {
            updatedOptions.status = status;
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
