const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    prasad: [
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
    
}, { timestamps: true })
const cartModel=mongoose.model('Cart',cartSchema)
module.exports=cartModel;