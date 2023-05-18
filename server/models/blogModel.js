const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const blogModel=mongoose.model("Blog",blogSchema);
module.exports=blogModel;