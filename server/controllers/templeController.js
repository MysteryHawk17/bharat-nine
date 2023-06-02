const templeDB = require("../models/templeModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");


const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Temple route established');
})


const createTemple = asynchandler(async (req, res) => {
    const { name, location, availableTimings, price } = req.body;
    if (!name || !location || !availableTimings || !price) {
        response.validationError(res, 'invalid inputs');
        return;

    }
    const newTemple = new templeDB({
        name: name,
        location: location,
        availableTimings: availableTimings,
        price: price
    })
    const savedTemple = await newTemple.save();
    if (savedTemple) {
        response.successResponst(res, savedTemple, 'Successfully saved the temple');
    }
    else {
        response.internalServerError(res, 'Failed to save the temple');
    }
})

const deleteTemple = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "invalid parameter field");
        return;

    }
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {
        const deletedTemple = await templeDB.findByIdAndDelete({ _id: id });
        if (deletedTemple) {
            response.successResponst(res, deletedTemple, "Successfully deleted the temple");
        }
        else {
            response.internalServerError(res, "Error in deleting the temple");
        }
    }
    else {
        response.notFoundError(res, "Cannot find the specied temple");
    }
})
const updateTemple = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "invalid parameter field");
        return;

    }
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {
        const updateData = {};
        const { name, location, availableTimings, price } = req.body;
        if (name) {
            updateData.name = name;
        }
        if (location) {
            updateData.location = location;
        }
        if (price) {
            updateData.price = price;
        }
        if (availableTimings) {
            updateData.availableTimings = availableTimings;
        }
        const updatedTemple = await templeDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedTemple) {
            response.successResponst(res, updatedTemple, "Successfully updated  the temple");
        }
        else {
            response.internalServerError(res, "Error in updating the temple");
        }
    }
    else {
        response.notFoundError(res, "Cannot find the specied temple");
    }
})
const getAllTemple = asynchandler(async (req, res) => {
    const getTemples = await templeDB.find({});
    if (getTemples) {
        response.successResponst(res, getTemples, 'Successfully fetched all the temples');
    }
    else {
        response.internalServerError(res, 'Failed to fetched the temples');
    }
})

const getAtemple = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "invalid parameter field");
        return;

    }
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {
        response.successResponst(res, findTemple, "Successfully fetched the temple");
    }
    else {
        response.notFoundError(res, "Cannot find the specied temple");
    }
})



module.exports = { test, createTemple, getAllTemple, getAtemple, updateTemple, deleteTemple };