const mongoose = require("mongoose");

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
    puja:[
        String
    ],
    image: {
        type: String
    },
    availableTimings: [{
        date: {
            type: String
        },
        time: {
            type: String
        }
    }],
    expertise: {
        type: String
    },
    languages: [
        String
    ],
    ratings: {
        type: Number,

    },
    price: {
        type: Number
    }

})

const panditModel = mongoose.model("Pandit", panditSchema);
module.exports = panditModel;
