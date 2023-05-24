const userDB = require("../models/userModel")
const cartDB = require("../models/cartModel")
const tokenDB=require("../models/tokenModel");
const crypto=require("crypto")
const response = require("../middlewares/responseMiddleware")
const asynchandler = require("express-async-handler");
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs")
const sendMail = require("../utils/sendmail")
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
        const salt = await bcrypt.genSalt(10);
        console.log(password)
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword);
        if (newCart) {
            const newUser = new userDB({
                displayName: displayName,
                email: email,
                password: hashPassword,
                phone: phone == undefined ? '' : phone,
                cartId: newCart._id,
                isAdmin: isAdmin ? isAdmin : false
            })
            const savedUser = await newUser.save();
            const updatedCart = await cartDB.findByIdAndUpdate({ _id: savedUser.cartId }, {
                userId: savedUser._id,
                products: []
            }, { new: true });
            console.log(updatedCart);
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
const forgotpassword = asynchandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        response.validationError(res,"Please fill in the field");
    }
    const user = await userDB.findOne({ email: email })
    if (!user) {
        response.notFoundError(res,"User not found");
    }
    else {
        const tokenExists = await tokenDB.findOne({ userId: user._id })
        if (tokenExists) {
            await tokenDB.deleteOne({ userId: user._id });
        }
        const resetToken = crypto.randomBytes(32).toString("hex") + user._id
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        console.log(resetToken)
        // console.log(hashedToken)
        const savedToken = await new tokenDB({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 30 * (60 * 1000)

        }).save();
        console.log(savedToken)
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
        console.log(resetUrl);
        const message =
            `<h2>Hello ${user.displayName}</h2>
        <p>Please click on the below link to reset the password</p>
        <p>The reset link is valid for 30 minutes</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Regards</p>`;
        const subject = "PASSWORD RESET"
        const send_to = user.email
        const sent_from = process.env.EMAIL_USER

        try {
            await sendMail(subject, message, send_to, sent_from);
            response.successResponst(res,'',"Successfully sent the mail");
        } catch {
            response.internalServerError(res,'Not able to send the mail');
        }

    }

})
const resetpassword = asynchandler(async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const verifyToken = await tokenDB.findOne({ token: hashedToken, expiresAt: { $gt: Date.now() } })
    if (!verifyToken) {
        res.status(400)
        throw new Error("Invalid or Expired Token")
    }
    const user = await userDB.findOne({ _id: verifyToken.userId })
    if (!user) {
        res.status(404)
        throw new Error("User does not exists")
    }
    else {
        user.password = await bcrypt.hash(password,await bcrypt.genSalt(10));
        await user.save();
        res.status(200).json({ message: "Updated password successfully!" })
    }

})
module.exports = { registerUser, loginUser ,forgotpassword,resetpassword};
