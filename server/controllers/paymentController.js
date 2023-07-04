const sdk = require('api')('@instamojo/v2#40d2ktblgmqonaz');
const responst = require("../middlewares/responseMiddleware");
const asynchandler = require('express-async-handler');


const handlePayment = asynchandler(async (req, res) => {
    const { amount, purpose, buyer_name, email, phone } = req.body;
    if (amount==undefined||amount==null || !purpose || !buyer_name || !email || !phone) {
        return responst.validationError(res, 'All the details are required');
    }
    const { data } = await sdk.generateAccessTokenApplicationBasedAuthentication({
        grant_type: 'client_credentials',
        client_id: process.env.INSTAMOJO_CLIENT_ID,
        client_secret:process.env.INSTAMOJO_CLIENT_SECRET
    }, { accept: 'application/json' });
    if (!data) {

        return responst.internalServerError(res, "Cannot henerate the client token");
    }
    const token = data.access_token;
    await sdk.auth(`Bearer ${token}`);
    const response = await sdk.createAPaymentRequest1({
        allow_repeated_payments: false,
        send_email: true,
        amount: amount,
        purpose: purpose,
        buyer_name: buyer_name,
        email: email,
        phone: phone
    }, { accept: 'application/json' })

    if(!response){
        return responst.internalServerError(res,"Failed to generate the payment link");
    }
    console.log(response.data.longurl)
    responst.successResponst(res,response.data,'Successfully generated the payment link')



})


module.exports = { handlePayment }