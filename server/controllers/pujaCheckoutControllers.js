const pujaCheckoutDB = require("../models/pujaCheckoutModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responseMiddleware")
const templeDB = require("../models/templeModel");
const panditDB = require("../models/panditModel");

const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Successfully established the routes');
})

const addOnlineHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { templeId, date, time, puja, name, address, cost, payment_mode } = req.body;
    if (!templeId || !date || !time || !puja || !name || !cost || !address || !payment_mode) {
        response.validationError(res, "Please fill in the details properly");
        return;
    }

    const temple = await templeDB.findById({ _id: templeId });
    if (temple) {
        const availableTimings = temple.availableTimings;
        console.log(availableTimings)
        const findIndex = availableTimings.findIndex(obj => obj.date === date && obj.time === time);
        console.log(findIndex);
        if (findIndex !== -1) {
            availableTimings.splice(findIndex, 1);
        }
        console.log(availableTimings);
        const updatedTemple = await templeDB.findByIdAndUpdate({
            _id: templeId
        }, {
            availableTimings: availableTimings
        }, { new: true });
        const newHistory = new pujaCheckoutDB({
            userId: userId,
            address: address,
            puja: puja,
            mode: "ONLINE",
            templeId: templeId,
            date: date,
            time: time,
            cost: cost,
            payment_mode: payment_mode,
            payment_status: "PENDING",
            order_status: "RESERVED",
            cc_orderId: '',
            cc_bankRefNo: ''
        })


        if (updatedTemple) {
            const savedHistory = await newHistory.save();


            if (savedHistory && updatedTemple) {
                response.successResponst(res, savedHistory, 'Successfully saved the history');
            }
            else {
                response.internalServerError(res, "Error in saving the booking history");
            }
        }
        else {
            response.internalServerError(res, "Error in updating temple booking history");
        }

    }
    else {
        response.notFoundError(res, "Cannot able to find the temple");
    }
})
const addOfflineHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { address, puja, phone, email, date, time, cost, payment_mode, panditId } = req.body;
    if (!address || !puja || !phone || !email || !date || !time || !cost || !payment_mode || !panditId) {
        response.validationError(res, 'Please fill in the valid details properly.')
        return;
    }
    const newHistory = new pujaCheckoutDB({
        userId: userId,
        address: address,
        puja: puja,
        phone: phone,
        mode: "OFFLINE",
        email: email,
        date: date,
        time: time,
        cost: cost,
        panditId: panditId,
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

const getAllBookings = asynchandler(async (req, res) => {
    const { mode } = req.query;
    const queryObj = {};
    if (mode) {
        queryObj.mode = mode;
    }
    const allBookings = await pujaCheckoutDB.find(queryObj).populate("templeId").populate("panditId").populate("userId").populate("Puja");
    if (allBookings) {
        response.successResponst(res, allBookings, 'Fetched all data successfully');
    }
    else {
        response.internalServerError(res, 'Unable to fetch the data');
    }
})
const getAbooking = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return response.validationError(res, "Invalid parametes");
    }
    const findBooking = await pujaCheckoutDB.findById({ _id: id }).populate("templeId").populate("panditId").populate("userId").populate("Puja");
    if (findBooking) {
        response.successResponst(res, findBooking, 'Successfully fetched the required data');
    }
    else {
        response.notFoundError(res, 'Failed to fetch the specified data');
    }
})
const getUserBookings = asynchandler(async (req, res) => {
    const id = req.user._id;
    const findAllBookings = await pujaCheckoutDB.find({ userId: id }).populate("templeId").populate("panditId").populate("userId").populate("Puja")
        ;
    if (findAllBookings) {
        response.successResponst(res, findAllBookings, "Successfully fetched for the user");
    }
    else {
        response.internalServerError(res, 'Cannot fetch for the specified user');
    }
})

const updateStatus = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, "Cannot find suitable parametes");

    }
    const findOrder = await pujaCheckoutDB.findById({ _id: id });
    if (findOrder) {
        const { order_status } = req.body;
        const updatedBookings = await pujaCheckoutDB.findByIdAndUpdate({ _id: id }, {
            order_status: order_status
        }, { new: true });
        if (updatedBookings) {
            response.successResponst(res, updatedBookings, 'Successfully updated the bookings');
        }
        else {
            response.internalServerError(res, "Failed to update the bookings");
        }

    }
    else {
        response.notFoundError(res, "Cannot found the specified booking");
    }

})

module.exports = { test, addOfflineHistory, addOnlineHistory, getAllBookings, getUserBookings, getAbooking, updateStatus }