const mongoose = require("mongoose");

const pujaSchema = mongoose.Schema({
    name:
    {
        type: String,

    },
    specifications: {
        type: String
    },
    qna: [{
        question: {
            type: String
        },
        answer: {
            type: String
        }
    }],
    description: {
        type: String
    },
    templeIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Temple"
        }
    ],
    panditIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pandit"
        }
    ],
    image: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    based: {
        type: String,
        enum: ['GOD-GODESSES', 'OCCASION', 'INDIVIDUAL'],

    },
    inclusions:[String]
})


const pujaModel=mongoose.model("Puja",pujaSchema);

module.exports=pujaModel;