const pujaDB = require("../models/pujaModel");
const templeDB = require("../models/templeModel");
const cloudinary = require("../utils/cloudinary");
const asynchanler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");
const test = asynchanler(async (req, res) => {
    response.successResponst(res, '', 'Puja routes established');
})

const createPuja = asynchanler(async (req, res) => {
    const { name, cost, description, temple, based } = req.body;
    console.log(req.file)
    console.log(req.body)
    if (!name ||
        !cost ||
        !description ||
        !temple ||
        !based ||
        !req.file) {
        response.validationError(res, "Please fill in the details")
        return;
    }
    var imageUrl = ''
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const templeArray = temple.split(',');
    imageUrl = uploadedImg.secure_url;
    const newPuja = new pujaDB({
        name: name,
        cost: cost,
        description: description,
        temple: templeArray,
        image: imageUrl,
        based: based
    })
    const savedPuja = await newPuja.save();
    if (savedPuja) {
        response.successResponst(res, savedPuja, "Successfully saved a puja")
    }
    else {
        response.internalServerError(res, "Failed to save puja");
    }

})
const getbasedPuja = asynchanler(async (req, res) => {
    const { based } = req.query;
    const getAllPuja = await pujaDB.find({ based: based }).populate('temple');
    if (getAllPuja) {
        response.successResponst(res, getAllPuja, `Successfully fetched puja based on ${based}`);
    }
    else {
        response.internalServerError(res, `Error in fetching puja based on ${based}`);
    }
})
const getPuja = asynchanler(async (req, res) => {

    const id = req.params.id;
    if (!id) {
        response.validationError(res, "Invalid parameters");
        return;
    }
    const findPuja = await pujaDB.findById({ _id: id });
    if (findPuja) {
        response.successResponst(res, findPuja, "Successfully found the PufindPuja");
    }
    else {
        response.notFoundError(res, "Specified PufindPuja not found");
    }

})


const getLocationPuja = asynchanler(async (req, res) => {
    const { location } = req.query;
    const getAllPuja = await pujaDB.find().populate('temple');
    if (getAllPuja) {
        const fiteredData = getAllPuja.filter((puja) => {
            return puja.temple.some(temp => temp.location === location);
        })
        response.successResponst(res, fiteredData, "Fetched based on location")
    }
    else {
        response.internalServerError(res, "Unable to fetch the data");
    }


})
const deletePuja = asynchanler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameter");
        return;
    }
    else {
        const findPuja = await pujaDB.findById({ _id: id });
        if (findPuja) {
            const deletedPuja = await pujaDB.findByIdAndDelete({ _id: id });
            if (deletedPuja) {
                response.successResponst(res, deletedPuja, "Successfully deleted the puja");

            }
            else {
                response.internalServerError(res, "Failed to delete the puja");
            }
        }
        else {
            response.notFoundError(res, 'Puja not found');
        }
    }
})

const updatePuja = asynchanler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameter");
        return;
    }
    const findPuja = await pujaDB.findById({ _id: id });
    if (findPuja) {
        const { cost, description, duration, name, based } = req.body;
        const updateData = {};
        if (cost) {
            updateData.cost = cost;
        }
        if (name) {
            updateData.name = name;
        }
        if (based) {
            updateData.based = based;
        }
        if (description) {
            updateData.description = description
        }
        if (duration) {
            updateData.duration = duration;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            })
            updateData.imageUrl = uploadedData.secure_url;
        }
        const updatedPuja = await pujaDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedPuja) {
            response.successResponst(res, updatedPuja, "Successfully updated the puja");
        }
        else {
            response.internalServerError(res, "Failed to update the puja");
        }
    }
    else {
        response.notFoundError(res, "Unable to find the specified puja")
    }

})
//create a function to handlecheckout which takes all the data from the body and forms a final history of data 
module.exports = { test, createPuja, getbasedPuja, getLocationPuja, deletePuja, updatePuja ,getPuja};