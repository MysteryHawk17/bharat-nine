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
    displayImages: [
        {
            url: {
                type: String,

            }
        }],
    description: {
        type: String
    },
    specifications: {
        type: String,
        required: true
    },
    qna: [{
        question: {
            type: String
        },
        answer: {
            type: String
        }
    }],
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
    },
    status: {
        type: String,
        required: true
    },
    dateOfExp: {
        type: String,
        required: true
    }

}, { timestamps: true })

const prasadModel = mongoose.model("Prasad", prasadSchema)
module.exports = prasadModel;