const mongoose = require("mongoose");

const checkoutSchema = mongoose.Schema({
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
    panditId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pandit"
    },
    mode: {
        type: String,
        enum: ['ONLINE', 'OFFLINE'],
        required: true
    },
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Temple"
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


const checkoutModel = mongoose.model("PujaCheckout", checkoutSchema);

module.exports = checkoutModel