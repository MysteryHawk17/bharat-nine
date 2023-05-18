const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    displayImage: {
        type:String,
        
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },//reference to cart created at the time of creation of the profile
    pujaHistoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PujaHistory"
    },
    panditHistoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PanditHistory"
    },
    prasadHistoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PrasadHistory"
    },
    shippingAddress: [
        {
            address: {
                type: String,
            },
            pincode: {
                type: Number,
            },
            isDefault: {
                type: Boolean,
                default: false,
            },
        },
    ],
    isAdmin:{
        type:Boolean,
        default:false
    }



},{timestamps:true})

const userModel=mongoose.model("User",userSchema)
module.exports=userModel;