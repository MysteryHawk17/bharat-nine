const panditHistoryDB = require("../models/panditHistory");
const panditDB = require("../models/panditModel");
const asynchandler = require("express-async-handler");
const response = require('../middlewares/responseMiddleware')


const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Pandit History Route established');
})

const addHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { address, puja, phone, email, date, time, cost, payment_mode, inclusion, panditId } = req.body;
    if (!address || !puja || !phone || !email || !date || !time || !cost || !payment_mode || !inclusion || !panditId) {
        response.validationError(res, 'Please fill in the valid details properly.')
        return;
    }
    const newHistory = new panditHistoryDB({
        userId: userId,
        address: address,
        puja: puja,
        phone: phone,
        email: email,
        date: date,
        time: time,
        cost: cost,
        pandit: panditId,
        inclusion: inclusion,
        payment_mode: payment_mode,
        payment_status: "PENDING",
        order_status: "RESERVED",
        cc_orderId: '',
        cc_bankRefNo: ''
    })
    const pandit = await panditDB.findById({ _id: panditId });
    if (pandit) {
        const availableTimings = pandit.availableTimings;
        console.log(availableTimings)
        const findIndex = availableTimings.findIndex(obj => obj.date === date && obj.time === time);
        console.log(findIndex);
         availableTimings.splice(findIndex, 1);
        console.log(availableTimings);
        const updatedPandit = await panditDB.findByIdAndUpdate({
            _id: panditId
        }, {
            availableTimings: availableTimings
        }, { new: true });
        
        if (updatedPandit) {
            const savedHistory = await newHistory.save();
            if (savedHistory) {
                response.successResponst(res, savedHistory, "Successfully saved the history");
            }
            else {
                response.internalServerError(res, "Error in saving history");
            }

        }
        else {
            response.errorResponse(res, "Cannot update pandit timings", 500);
        }
    }
    else {
        response.notFoundError(res, "Error in finding the pandit");
    }



})

const getHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const getAllHistory = await panditHistoryDB.find({ userId: userId }).populate('userId').populate({
        path: "pandit",
        select: "name location exp puja image"
    })
    if (getAllHistory) {
        response.successResponst(res, getAllHistory, "Successfully fetched the data");
    }
    else {
        response.internalServerError(res, "Error in fetching the history");
    }
})
const getAllBookings = asynchandler(async (req, res) => {
    const allBookings = await panditHistoryDB.find().populate("userId").populate("pandit");
    if (allBookings) {
        response.successResponst(res, allBookings, "Successfully fetched the bookings");
    }
    else {
        response.internalServerError(res, "Failed to fetch the bookings");
    }
})


module.exports = { test, addHistory, getAllBookings, getHistory };

