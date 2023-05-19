const mongoose=require("mongoose");

const prasadHistorySchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    email:{
        type:String
    },
    address: {
        type: Object
    },
    products: [
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Prasad"
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            }
        }
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
        enum: ["ORDERED", "COMPLETED", "CANCELLED", "CANCELLED BY ADMIN"],
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

const prasadHistoryModel=mongoose.model("PrasadHistory",prasadHistorySchema);

module.exports=prasadHistoryModel