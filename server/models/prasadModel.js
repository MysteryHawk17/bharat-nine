const mongoose = require("mongoose")


const prasadSchema = mongoose.Schema({
    templeName: {
        type: String,
        required: true
    },
    location: [{
        address: {
            type: String,
        },
        pincode: {
            type: Number,
        }
    }],
    cost: {
        type: Number,
        required: true
    },
    itemsIncluded: [{
        type: String,
        required: true
    }],
    displayImage: {
        type: String,

    },
    description: {
        type: String
    },
    howToReach: {
        type: String
    },
    geoLat: {
        type: Number,

    },
    geoLong: {
        type: Number
    },
    productCode: {
        type: String
    }

}, { timestamps: true })

const prasadModel = mongoose.model("Prasad", prasadSchema)
module.exports = prasadModel;