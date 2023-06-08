const userDB = require("../models/userModel")
const prasadDB = require("../models/prasadModel")
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const shortid = require("shortid");
const cloudinary = require("../utils/cloudinary")
const shortidChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@";

const createPrasad = asynchandler(async (req, res) => {
    const { templeName, address, pincode, cost, description, howToReach, geoLat, geoLong, itemsIncluded, status, dateOfExp, specifications, qna } = req.body;

    if (!templeName || !address || !pincode || !cost || !description || !howToReach || !geoLat || !geoLong || !itemsIncluded || !status || !dateOfExp || !specifications || !qna || !req.files) {
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
    console.log(req.files);
    var displayImages = [];
    const uploadFile = async (e) => {
        const uploadedImg = await cloudinary.uploader.upload(e.path, {
            folder: "Bharat One"
        })
        const obj = { url: uploadedImg.secure_url };
        console.log(obj)
        displayImages = [...displayImages, obj]

    }
    const len = req.files.length;
    console.log(len)
    for (let i = 0; i < len; i++) {
        await uploadFile(req.files[i]);
    }
    console.log(displayImages)
    const items = itemsIncluded.split(',');

    const newPrasad = new prasadDB({
        templeName: templeName,
        location: location,
        cost: cost,
        itemsIncluded: items,
        displayImages: displayImages,
        description: description,
        howToReach: howToReach,
        geoLat: geoLat,
        geoLong: geoLong,
        productCode: productId,
        status: status,
        dateOfExp: dateOfExp,
        specifications: specifications,
        qna: JSON.parse(qna)
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
        const { cost, templeName, description, status, dateOfExp, address, pincode, specifications, qna } = req.body;
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
        if (qna) {
            updatedOptions.qna = JSON.parse(qna);
        }
        if (specifications) {
            updatedOptions.specifications = specifications
        }
        if (req.files) {

            var displayImages = [];
            const uploadFile = async (e) => {
                const uploadedImg = await cloudinary.uploader.upload(e.path, {
                    folder: "Bharat One"
                })
                const obj = { url: uploadedImg.secure_url };
                console.log(obj)
                displayImages = [...displayImages, obj]

            }
            const len = req.files.length;
            console.log(len)
            for (let i = 0; i < len; i++) {
                await uploadFile(req.files[i]);
            }
            console.log(displayImages)
            updatedOptions.displayImages = displayImages;
        }
        if (address || pincode) {
            const location = {
                address: address,
                pincode: pincode
            }
            updatedOptions.location = location;
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

module.exports = { createPrasad, getAllPrasad, getPrasad, deletePrasad, updatePrasad };
