const mongoose = require("mongoose")

const panditSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    exp: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    puja: [
        String
    ],
    image: {
        type: String
    },
    unavailableTimings: [{
        date: {
            type: String
        },
        time: {
            type: String
        }
    }]
})

const panditModel = mongoose.model("Pandit", panditSchema)

module.exports = panditModel;