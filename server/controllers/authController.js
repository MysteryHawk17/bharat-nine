const userDB = require("../models/userModel")
const cartDB = require("../models/cartModel")
const pujaHistoryDB=require("../models/pujaHistory")
const panditHistoryDB=require("../models/panditHistory");
const prasadHistoryDB=require("../models/prasadHistory");
const response = require("../middlewares/responseMiddleware")
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary")
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs")
const registerUser = asynchandler(async (req, res) => {
    console.log(req.body)
    const { displayName, email, password, phone, isAdmin } = req.body;
    if (!displayName || !email || !password) {
        response.validationError(res, 'Please enter valid details in all fields')
        return;
    }
    const findUser = await userDB.findOne({ email: email });
    if (findUser) {
        response.errorResponse(res, "User already exists.Please login", 400);
        return;
    }
    else {
        const newCart = await cartDB.create({});
        const newPujaHistory = await pujaHistoryDB.create({});
        const newPanditHistory=await panditHistoryDB.create({});
        const newPrasadHistory=await prasadHistoryDB.create({});
        const salt = await bcrypt.genSalt(10);
        console.log(password)
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword);
        if (newCart && newPujaHistory&&newPanditHistory&&newPrasadHistory) {
            var displayURL = '';
            if (req.file) {
                const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Bharat One"
                })
                displayURL = uploadedImg.secure_url;
            }


            const newUser = new userDB({
                displayName: displayName,
                email: email,
                password: hashPassword,
                phone: phone == undefined ? '' : phone,
                displayImage: displayURL == '' ? 'https://asset.cloudinary.com/dvlksubek/6b7279e45fa276aedde3413c95ecdde4' : displayURL,
                cartId: newCart._id,
                pujaHistoryId:newPujaHistory._id,
                prasadHistoryId:newPrasadHistory._id,
                panditHistoryId:newPanditHistory._id,
                isAdmin: isAdmin ? isAdmin : false
            })
            const savedUser = await newUser.save();
            const token = jwt(savedUser._id);
            const { password, createdAt, updatedAt, ...other } = savedUser._doc;


            const data = {
                other,
                token: token
            }
            if (savedUser) {
                response.successResponst(res, data, "User created Successfully")
            }
            else {
                response.errorResponse(res, 'Error in creating user', 400);
            }
        }
        else {
            response.errorResponse(res, "Error in creating new cart or new historys", 400);
        }
    }
})

const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, "Please fill in the details properly")
    }
    else {
        const findUser = await userDB.findOne({ email: email });
        if (findUser) {
            const comparePassword = await bcrypt.compare(password, findUser.password);
            if (comparePassword) {
                const token = jwt(findUser._id);
                const { password, createdAt, updatedAt, ...other } = findUser._doc;
                const data = {
                    other,
                    token: token
                }
                response.successResponst(res, data, "Login successful");

            }
            else {
                response.validationError(res, "Password incorrect");
            }

        }
        else {
            response.notFoundError(res, "User not found");
        }

    }
})
module.exports = { registerUser, loginUser };
