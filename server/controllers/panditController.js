const panditDB = require("../models/panditModel")
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");
const cloudinary = require('../utils/cloudinary')
const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Pandit routes established')
})

const createPandit = asynchandler(async (req, res) => {
    const { name, location, exp, puja } = req.body;
    if (!name || !location || !exp || !puja) {
        response.validationError(res, "Fill in the details properly");
        return;
    }

    var image = '';
    if (req.file) {
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            folder: "Bharat One"
        })
        image = uploadedData.secure_url
    }
    const newPandit = new panditDB({
        name: name,
        location: location,
        exp: exp,
        puja: puja,
        image: image
    })
    const savedPandit = await newPandit.save();

    if (savedPandit) {
        response.successResponst(res, savedPandit, "Successfully saved the Pandit");
    }
    else {
        response.internalServerError(res, "Error in saving the Pandit");
    }
})
const getAllPandit = asynchandler(async (req, res) => {
    const getAllPandit = await panditDB.find({});
    if (getAllPandit) {
        response.successResponst(res, getAllPandit, "Successfully fetched the pandits");
    }
    else {
        response.internalServerError(res, "Not able to fetch the pandits")
    }
})

const getlocationPandit = asynchandler(async (req, res) => {
    const { location } = req.query;
    const getAllPandit = await panditDB.find({ location: location });
    if (getAllPandit) {
        response.successResponst(res, getAllPandit, "Successfully fetched the pandits");
    }
    else {
        response.internalServerError(res, "Not able to fetch the pandits")
    }
})
const getPujaBasedPandit = asynchandler(async (req, res) => {
    const { puja } = req.query;
    const getAllPandit = await panditDB.find({});
    if (getAllPandit) {
        const filtered = getAllPandit.filter((e) => {
            return (e.puja.includes(puja));
        })
        response.successResponst(res, filtered, "Successfully fetched the pandits");
    }
    else {
        response.internalServerError(res, "Not able to fetch the pandits")
    }
})
const availablepandit = asynchandler(async (req, res) => {
    const { date, time } = req.body;
    const { location } = req.query;
    const fetchedPandit=await panditDB.find({
        location:location,
        unavailableTimings:{
            $not:{
                $elemMatch:{
                    date:date,
                    time:time
                }
            }
        }
    })
    if(fetchedPandit){
        response.successResponst(res,fetchedPandit,"Successfully fetched the pandits");
    }
    else{
        response.internalServerError(res,"Error in fetching the pandit");
    }

})
const updatePandit = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameter");
    }
    else {
        const findPandit = await panditDB.findById({ _id: id });
        if (findPandit) {
            const updateData = {};
            const { exp, puja, location } = req.body;

            if (exp) {
                updateData.exp = exp;
            }
            if (location) {
                updateData.location = location;
            }
            if (req.file) {
                const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Bharat One"
                })
                
                updateData.image = uploadedData.secure_url;
            }

            const updatedPandit = await panditDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });

            if (puja) {
                const finalUpdate = await panditDB.findByIdAndUpdate({ _id: id }, {
                    $push: { puja: puja }
                }, { new: true });

                if (updatedPandit && finalUpdate) {
                    response.successResponst(res, finalUpdate, "Successfully updated the pandit");
                }
                else {
                    response.internalServerError(res, "Error in updating the pandit");
                }
            }
            else {
                if (updatedPandit) {
                    response.successResponst(res, updatedPandit, "Successfully updated the pandit");
                }
                else {
                    response.internalServerError(res, "Error in updating the pandit");
                }
            }
        }
        else {
            response.notFoundError(res, 'pandit not found');
        }
    }
})
const deletePandit = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameter");
    }
    else {
        const findPandit = await panditDB.findById({ _id: id });
        if (findPandit) {
            const deletedPandit = await panditDB.findByIdAndDelete({ _id: id });
            if (deletedPandit) {
                response.successResponst(res, deletedPandit, "Successfully deleted the pandit");

            }
            else {
                response.internalServerError(res, "Failed to delete the pandit");
            }
        }
        else {
            response.notFoundError(res, 'pandit not found');
        }
    }
})
module.exports = { test, createPandit, updatePandit, deletePandit, getAllPandit, getlocationPandit, getPujaBasedPandit, availablepandit };
