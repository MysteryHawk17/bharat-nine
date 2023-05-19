const pujaDB = require("../models/pujaModel")
const templeDB = require("../models/templeModel")
const pujaHistoryDB = require("../models/pujaHistory")
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")

const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Puja History controller established');
})

const addHistory = asynchandler(async (req, res) => {
    const  userId  = req.user._id;
    const { templeId, date, time, mode, puja, name, address, price, payment_mode } = req.body;
    if (!templeId ||
        !date ||
        !time ||
        !mode ||
        !puja ||
        !name ||
        !price ||
        !address ||
        !payment_mode) {
        response.validationError(res, "Please fill in the details properly");
        return;
    }
    mode = mode.toUpperCase();
    if (mode != 'ONLINE' || mode != "OFFLINE") {
        response.validationError(res, "Please fill in the details properly");
        return;
    }
    const temple = await templeDB.findById({ _id: templeId });
    if (temple) {

        const newHistory = await pujaHistoryDB({
            userId: userId,
            address: address,
            puja: puja,
            mode: mode,
            temple: templeId,
            date: date,
            time: time,
            cost: price,
            payment_mode: payment_mode,
            payment_status: "PENDING",
            order_status: RESERVED,
            cc_orderId: '',
            cc_bankRefNo: ''
        })
        const reservedDate = {
            date: date,
            time: time
        }
        const updateTemple = await templeDB.findByIdAndUpdate({ _id: templeId }, {
            $push: { bookingData: reservedDate }
        }, { new: true });

        if (updateTemple) {
            const savedHistory = await newHistory.save();


            if (savedHistory && updateTemple) {
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

const getHistory = asynchandler(async (req, res) => {
    const userId=req.user._id;
    const getAllHistory=await pujaHistoryDB.find({userId:userId}).populate("userId").populate({
        path:"temple",
        select:"name location"
    })
    if(getAllHistory){
        response.successResponst(res,getAllHistory,"Successfully fetched the history");
    }   
    else{
        response.internalServerError(res,"Error in fetching the history");
    }
})
const getAllBookings = asynchandler(async (req, res) => {
    const allBookings=await pujaHistoryDB.find().populate("userId").populate("temple");
    if(allBookings){
        response.successResponst(res,allBookings,"Successfully fetched the bookings");
    }
    else{
        response.internalServerError(res,"Failed to fetch the bookings");
    }
})


module.exports = { test ,addHistory,getAllBookings,getHistory};

