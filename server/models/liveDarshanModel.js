const mongoose = require("mongoose");

const darshanSchema = ({
    name: {
        type: String,
        required: true
    },
    temple: {
        type: String,
        required: true
    },
    ytLink: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ONGOING', 'UPCOMING']
    },
    pujaLink: {
        type: String,
        required: true
    },
    prasadLink: {
        type: String,
        required: true
    },

})

const darshanModel = mongoose.model("Darshan", darshanSchema);

module.exports = darshanModel;