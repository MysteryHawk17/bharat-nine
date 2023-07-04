const axios = require('axios');
const response = require("../middlewares/responseMiddleware");
const asynchandler = require('express-async-handler');


const handlePayment = asynchandler(async (req, res) => {
    const { amount, purpose, buyer_name, email, phone, redirect_url, weburl } = req.body;
    if (amount == undefined || amount == null || !purpose || !buyer_name || !email || !phone || !redirect_url || !weburl) {
        return response.validationError(res, 'All the details are required');
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('grant_type', 'client_credentials');
    encodedParams.set('client_id', process.env.INSTAMOJO_CLIENT_ID,);
    encodedParams.set('client_secret', process.env.INSTAMOJO_CLIENT_SECRET);

    const options1 = {
        method: 'POST',
        url: 'https://api.instamojo.com/oauth2/token/',
        headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: encodedParams,
    };
    const tokenResponse = await axios.request(options1);
    if (!tokenResponse) {
        return response.internalServerError(res, 'Cannot generate token');
    }
    // console.log(tokenResponse);
    const token = tokenResponse.data.access_token;
    console.log(token)
    const encodedParams2 = new URLSearchParams();
    encodedParams2.set('allow_repeated_payments', 'false');
    encodedParams2.set('send_email', 'true');
    encodedParams2.set('amount', amount);
    encodedParams2.set('purpose', purpose);
    encodedParams2.set('buyer_name', buyer_name);
    encodedParams2.set('email', email);
    encodedParams2.set('phone', phone);
    encodedParams2.set('redirect_url', redirect_url);
    encodedParams2.set('webhook', weburl);

    const options2 = {
        method: 'POST',
        url: 'https://api.instamojo.com/v2/payment_requests/',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: encodedParams2,
    };
    try {

        const linkResponse = await axios.request(options2);
        if (!linkResponse) {
            return response.internalServerError(res, 'Cannot generate linkk for payment');
        }
        console.log(linkResponse.data);
        console.log(linkResponse.data.longurl)
        response.successResponst(res, linkResponse.data, 'Successfully generated the payment link');
    } catch (error) {
        console.log(error)
    }




})

const webhookUrl = asynchandler(async (req, res) => {   
        console.log(req.body);

})
module.exports = { handlePayment, webhookUrl }