const mongoose = require("mongoose");

const panditHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address: {
        type: Object
    },
    puja: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String
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
    pandit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pandit"
    },
    inclusion: [
        String
    ],
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

const panditHistoryModel = mongoose.model("PanditHistory", panditHistorySchema);

module.exports = panditHistoryModel