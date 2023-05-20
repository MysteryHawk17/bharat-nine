const cartDB = require("../models/cartModel")
const prasadHistoryDB = require("../models/prasadHistory");
const userDB = require("../models/userModel");
const asynchandler = require('express-async-handler')
const response = require("../middlewares/responseMiddleware");
const prasadHistoryModel = require("../models/prasadHistory");

const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Prasad checkout route established');
})

const addToCart = asynchandler(async (req, res) => {
    const cartId = req.user.cartId;
    console.log(req.body)
    const { productId, quantity } = req.body;
    const cart = await cartDB.findById({ _id: cartId });
    if (cart) {
        const productIndex = cart.prasad.findIndex(p => p.product == productId);
        if (productIndex == -1) {
            const product = {
                product: productId,
                quantity: quantity
            }
            cart.prasad.splice(0, 0, product);
        }
        else{
        console.log(productIndex)
        const removeItem = cart.prasad.splice(productIndex, 1);
        const product = {
            product: productId,
            quantity: quantity
        }
        if (quantity !== 0) {
            cart.prasad.splice(productIndex, 0, product);
        }
    }
        const success = await cart.save();
        const cartF = await cartDB.findById({ _id: cartId });
        if (success && cartF) {
            response.successResponst(res, cartF, "Updated cart fetched successfully");
        }
        else {
            response.internalServerError(res, "Error in updating the cart");
        }
    }
    else {
        response.notFoundError(res, "Cannot find the cart assotiated with this cart id");
    }
})
const getCartDetails = asynchandler(async (req, res) => {
    const cartId = req.user.cartId;
    console.log(cartId);

    const cartDetails = await cartDB.findById({ _id: cartId });
    if (cartDetails) {
        response.successResponst(res, cartDetails, 'Successfully fetched the cart details');
    }
    else {
        response.internalServerError(res, 'Unable to fetch the cart details');
    }

})

const prasadCheckout = asynchandler(async (req, res) => {
    const id = req.user._id;
    const { email, address, payment_mode } = req.body;
    const user = await userDB.findById({ _id: id });
    if (user) {
        const findCart = await cartDB.findById({ _id: user.cartId });
        console.log(findCart);
        if (findCart.prasad.length == 0) {
            response.errorResponse(res, "Cart is empty", 400);
        }
        else {
            const newHistoryItem = new prasadHistoryDB({
                userId: user._id,
                email: email,
                address: address,
                payment_mode: payment_mode,
                payment_status: "PENDING",
                order_status: "ORDERED",
                products: findCart.prasad,
                cc_orderId: '',
                cc_bankRefNo: ''
            })
            const savedHistoryItem = await newHistoryItem.save();
            if (savedHistoryItem) {
                response.successResponst(res, savedHistoryItem, 'Successfully saved the history item')
            }
            else {
                response.internalServerError(res, "Error in saving the history item");
            }


        }
    }
    else {
        response.notFoundError(res, "Cannot find user");
    }

})
const getPrasadHistory = asynchandler(async (req, res) => {
    const id = req.user._id;
    const prasadHistoryItem = await prasadHistoryDB.find({ userId: id }).populate({ path: 'products.product', select: 'email address' })
    console.log(prasadHistoryItem)
    if (prasadHistoryItem) {
        response.successResponst(res, prasadHistoryItem, 'Successfully fetched the item');
    }
    else {
        response.internalServerError(res, "Error in fetching history");
    }
})

module.exports = { test, addToCart, prasadCheckout, getPrasadHistory, getCartDetails };