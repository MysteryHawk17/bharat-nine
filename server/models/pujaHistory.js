const mongoose = require("mongoose");

const pujaHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address: {
        type: Object
    },
    puja: {
        type: String
    },
    mode: {
        type: String,
        enum: ['ONLINE', 'OFFLINE'],
        required: true
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Temple"
    },
    date: {
        type: String,
    },
    time: {
        type: String
    },
    cost: {
        type: Number
    },
    payment_mode: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["PENDING", "COMPLETE", "FAILED"],
        required: true,
    },
    order_status: {
        type: String,
        enum: ["RESERVED", "COMPLETED", "CANCELLED", "CANCELLED BY ADMIN"],
        required: true,
        default: "RESERVED",
    },
    cc_orderId: {
        type: String,
        // required: true,
    },
    cc_bankRefNo: {
        type: String,
        // required: true,
    },


})

const pujaHistoryModel = mongoose.model("PujaHistory", pujaHistorySchema);

module.exports = pujaHistoryModel