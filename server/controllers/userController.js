const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', "User routes established");
})

const getAllUser = asynchandler(async (req, res) => {
    const getAllUser = await userDB.find().populate("cartId");
    if (getAllUser) {
        response.successResponst(res, getAllUser, "Successfully fetched all the user");
    }
    else {
        response.internalServerError(res, "Unable to fetch the user");
    }

})
const getUser = asynchandler(async (req, res) => {
    const id = req.user._id;
    if (!id) {
        response.validationError(res, "Pass proper parameters");
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("cartId");
    if (findUser) {
        response.successResponst(res, findUser, 'Successfully fetched the user');

    }
    else {
        response.notFoundError(res, "User not found");
    }

})
const deleteUser = asynchandler(async (req, res) => {
    const id = req.user._id;
    if (!id) {
        response.validationError(res, "Fill in the proper field");
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("cartId");
    if (findUser) {
        const deletedUser = await userDB.findByIdAndDelete({ _id: id });
        if (deletedUser) {
            response.successResponst(res, deletedUser, "Successfully deleted the user");
        }
        else {
            response.internalServerError(res, "Cannot delete the user");
        }

    }
    else {
        response.notFoundError(res, "User not found");
    }
})
const updateUser = asynchandler(async (req, res) => {
    const id = req.user._id;
    if (!id) {
        response.validationError(res, "Fill in the proper field");
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("cartId");
    if (findUser) {
        const updateData = {};
        const { name, phone, address, pincode, isDefault } = req.body;
        if (name) {
            updateData.name = name;

        }
        if (phone) {
            updateData.phone = phone;

        }
        if (address && pincode) {
            const shipAddress = {
                address: address,
                pincode: pincode,
                isDefault: isDefault
            }
            const updateAddress = await userDB.findByIdAndUpdate({ _id: id },
                { $push: { shippingAddress: shipAddress } });
            const finalAddress = await userDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
            if (updateAddress && finalAddress) {
                response.successResponst(res, finalAddress, "Successfully updated the user");

            }
            else {
                response.internalServerError(res, "Error in updating the user");
            }


        }
        else {
            const updatedUser = await userDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
            if (updatedUser) {
                response.successResponst(res, updatedUser, 'Successfully updated the user');
            }
            else {
                response.asynchandler(res, "User updating failed");
            }
        }
    }
    else {
        response.notFoundError(res, "User not found");
    }
})
const resetPassword = asynchandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        response.validationError(res, "Unable to validate user");
        return
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        response.validationError(res, "Please provide both the fields properly");
        return;
    }
    const findUser = await userDB.findById({ _id: userId });
    if (findUser) {
        const verifyPassword = await bcrypt.compare(oldPassword, findUser.password);
        if (verifyPassword) {
            const salt=await bcrypt.genSalt(10);
            const newhashedPassword=await bcrypt.hash(newPassword,salt);
            const updatedUser=await userDB.findByIdAndUpdate({_id:userId},{
                password:newhashedPassword,
            },{new:true});
            if(updatedUser&&newhashedPassword){
                response.successResponst(res,updatedUser,"Successfully updated the user password");
            }
            else{
                response.internalServerError(res,"Failed to update the password");
            }
        }
        else {
            response.errorResponse(res, "Old password does not match", 400);
        }
    }
    else {
        response.notFoundError(res, "Given user not found");
    }
})
module.exports = { test, getAllUser, getUser, deleteUser, updateUser,resetPassword };




