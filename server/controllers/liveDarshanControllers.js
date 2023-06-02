const darshanDB = require("../models/liveDarshanModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware");

const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Darshan routes established')
})

const createDarshan = asynchandler(async (req, res) => {
    const { name, temple, ytLink, scheduledTime, status, pujaLink, prasadLink } = req.body;
    if (!name || !temple || !ytLink || !scheduledTime || !pujaLink || !prasadLink
        || !status) {
        response.validationError(res, "Please fill in the fields properly.");
        return;
    }
    var statusC = status.toUpperCase();
    console.log(statusC)
    const newDarshan = new darshanDB({
        name: name,
        temple: temple,
        ytLink: ytLink,
        scheduledTime: scheduledTime,
        status: statusC,
        prasadLink: prasadLink,
        pujaLink: pujaLink
    })
    const savedDarshan = await newDarshan.save();
    if (savedDarshan) {
        response.successResponst(res, savedDarshan, "Successfully save the darshan ");
    }
    else {
        response.internalServerError(res, 'Error in saving the darshan');
    }

})
const getAllDarshan = asynchandler(async (req, res) => {
    const getDarshans = await darshanDB.find();
    if (getDarshans) {
        response.successResponst(res, getDarshans, 'Fetched all the darshans successfully');
    }
    else {
        response.internalServerError(res, "Error in geting all the darshans");
    }
})

const getADarshan = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, "Please give proper parameters");
        return;
    }
    const findDarshan = await darshanDB.findById({ _id: id });
    if (findDarshan) {
        response.successResponst(res, findDarshan, "Fetched the darshan successfully");
    }
    else {
        response.notFoundError(res, "Error in finding the mentioned darshan");
    }
})

const deleteDarshan = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, "Please give proper parameters");
        return;
    }
    const darshan = await darshanDB.findById({ _id: id });
    if (darshan) {
        const deleteddarshan = await darshanDB.findByIdAndDelete({ _id: id });
        if (deleteddarshan) {
            response.successResponst(res, deleteddarshan, "Successfully deleted the darshan");
        }
        else {
            response.internalServerError(res, "Failed to update the darshan");
        }
    }
    else {
        response.notFoundError(res, "error in finding the darshan");
    }
})
const updateDarshan = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, "Please give proper parameters");
        return;
    }
    const darshan = await darshanDB.findById({ _id: id });
    if (darshan) {
        const updateData = {};
        const { name, temple, ytLink, scheduledTime, status, pujaLink, prasadLink } = req.body;
        if (name) {
            updateData.name = name;
        }
        if (temple) {
            updateData.temple = temple;
        }
        if (ytLink) {
            updateData.ytLink = ytLink;
        }
        if (scheduledTime) {
            updateData.scheduledTime = scheduledTime;
        }
        if (prasadLink) {
            updateData.prasadLink = prasadLink;
        }
        if (pujaLink) {
            updateData.pujaLink = pujaLink;
        }
        if (status) {

            updateData.status = status.toUpperCase();
        }
        const updatedDarshan = await darshanDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedDarshan) {
            response.successResponst(res, updatedDarshan, "Successfully updated the darshan");
        }
        else {
            response.internalServerError(res, "Failed to update the darshan");
        }
    }
    else {
        response.notFoundError(res, "error in finding the darshan");
    }
})

module.exports = { test, createDarshan, getADarshan, getAllDarshan, updateDarshan, deleteDarshan };



