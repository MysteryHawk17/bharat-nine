const panditDB = require("../models/panditModel");
const asynchandler = require('express-async-handler');
const response = require("../middlewares/responseMiddleware");
const cloudinary = require("../utils/cloudinary");


const test = asynchandler(async (req, res) => {
    response.successResponst(res, "", 'Successfully established the pandit routes');
})

const createPandit = asynchandler(async (req, res) => {
    const { name, location, exp, price, expertise, puja, language, availableTimings, ratings } = req.body;
    if (!name || !location || !exp || !price || !puja || !expertise || !language || !availableTimings || !ratings || !req.file) {
        response.validationError(res, "Fill in the details properly");
        return;
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const image = uploadedData.secure_url;
    const languageArray = language.split(",")
    const availableTimingsArray = JSON.parse(availableTimings);
    const newPandit = new panditDB({
        name: name,
        location: location,
        exp: exp,
        language: languageArray,
        expertise: expertise,
        availableTimings: availableTimingsArray,
        image: image,
        ratings: ratings,
        price: price,
        puja: puja.split(",")
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

const getAPandit = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, "Invalid parameters");
        return;
    }
    const findPandit = await panditDB.findById({ _id: id });
    if (findPandit) {
        response.successResponst(res, findPandit, "Successfully found the pandit");
    }
    else {
        response.notFoundError(res, "Specified pandit not found");
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
const updatePandit = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameter");
    }
    else {
        const findPandit = await panditDB.findById({ _id: id });
        if (findPandit) {
            const updateData = {};
            const { name, location, exp, puja, price, expertise, language, availableTimings, ratings } = req.body;
            if (name) {
                updateData.name = name;
            }
            if (price) {
                updateData.price
            }
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
            if (ratings) {
                updateData.ratings = ratings;
            }
            if (expertise) {
                updateData.expertise = expertise;
            }
            if (language) {
                const languageArray = language.split(",");
                updateData.languages = languageArray;
            }
            if (puja) {
                const pujaArray = puja.split(",");
                updateData.puja = pujaArray;
            }
            if (availableTimings) {
                const availableTimingsArray = JSON.parse(availableTimings);
                updateData.availableTimings = availableTimingsArray;
            }
            const updatedPandit = await panditDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
            if (updatedPandit) {
                response.successResponst(res, updatedPandit, "successfully updated the pandit");
            }
            else {
                response.internalServerError(res, 'Unable to update the pandit');
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

const availableTimings = asynchandler(async (req, res) => {
    const { date, time } = req.body;
    const { location, puja } = req.query;

    const fetchedPandit = await panditDB.find({
        location: location,

        availableTimings: {

            $elemMatch: {
                date: date,
                time: time
            }

        },
        puja: {
            $in: puja
        }
    })
    if (fetchedPandit) {
        response.successResponst(res, fetchedPandit, "Successfully fetched the pandits");
    }
    else {
        response.internalServerError(res, "Error in fetching the pandit");
    }
})
module.exports = { test, createPandit, deletePandit, updatePandit, getAllPandit, getAPandit, getPujaBasedPandit, getlocationPandit,availableTimings };