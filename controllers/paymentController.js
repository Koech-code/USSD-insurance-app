require("dotenv").config();
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

/**
 * The function "getJuniCredentials" returns an object containing a token and a client ID.
 * @returns An object containing the token and clientId from Juni.
 */
function getJuniCredentials() {
    return {
        // token: process.env.JUNIPAY_TOKEN,
        // clientId: process.env.CLIENT_ID
        token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoicGF5bG9hZF9leGFtcGxlIiwiaWF0IjoxNzAzOTI4ODg1fQ.alciR7iGDeGMg-gVbp_NYFewQjJV9BrRilVG3sroYf67Gb56_-duIlnllOUn9n1QNGp2NC2BQQuWSiwxECpvb0u87wN3h7hZpGhnv2KDjIFMsI9FQ3Ab2C81aOMajgree3dk6s_nhrjaJ3aIIg9n6Z6LoPhoICrwEZFucrMkyQ_RYsBUDSZP5vrYuR2lhQ-E1Ha6AejhqOadqNxU3dFIJCZ9YFG8N0WwtCzeVsuHGPPcpEYaWLK7MjMGMmxA_J3ZF1lw2ble8v6ELeBIwKJ2YR46z810wVvabN-OlhJlA5A7Bg6_LY8WYjAeCzp_z3hyNhlTWm9O4ss6HGfagA6W4GRc4s8E6oTtPOKxN5jSmO3EbhpPy6JT2iSYbWcIJ0wyQyanEWPMK95mhMbfn6Trt1NobIv9ZLVW7vhnMIzuqvRiH_uKqO8zQvTCL9ombLO91_419rw7JXFH3m6fUBqalZsF5Tvtm6nhBgsERikLLasLDddhJ91vSj8uGLRMGTN9B5q7zc_baRp9Gcvj2yBRg9jRKUjUlBxh56mSAJbLDLHGsqZzIFJbzbr0VKwHqTnlS3QBCD2luOiE94ErKTfM5mmd50NrWRUyWtgkm1dRlPYLs-59LANH4ATNcgsy7yhEpVaPrnwpWcFtBZRkd-6R0hX1F17clR6WAYQ1p0q9PFc",
        clientId: "Mqf10893"
    };
}

/**
 * The function is an asynchronous function that verifies a telephone number by making a GET
 * request to the Juni Payments API.
 * @param telephoneNumber - The `telephoneNumber` parameter is the phone number that you want to
 * verify. It should be a string representing a valid phone number.
 * @returns The function `verify` returns the data received from the API call if the call is
 * successful. If there is an error or the API call fails, it returns an object with a `status`
 * property set to "failed".
 */
async function verify(telephoneNumber) {
    let response

    var config = {
        method: "GET",
        url: `https://api.junipayments.com/resolve?channel=mobile_money&phoneNumber=${telephoneNumber}`,
        headers: {
            'cache-control': 'no-cache',
            'authorization': "Bearer " + getJuniCredentials().token,
            'clientid': getJuniCredentials().clientId
        }
    };
    try {
        response = await axios(config);
        return response.data;
    } catch (err) {
        return {
            status: "failed"
        }
    }
}

/**
 * The `pay` function is an asynchronous function that makes a POST request to the Juni Payments API to
 * initiate a payment transaction with the specified amount, total amount, provider, phone number,
 * description, callback URL, sender email, channel, and foreign ID.
 * @param amount - The `amount` parameter represents the amount of money to be paid.
 * @param tot_amnt - The `tot_amnt` parameter represents the total amount of the payment. It is the
 * total amount that the user needs to pay, including any additional fees or charges.
 * @param provider - The "provider" parameter refers to the payment service provider that you want to
 * use for the transaction. It could be a specific mobile money provider or any other payment service
 * provider that is supported by the Juni Payments API.
 * @param phoneNumber - The `phoneNumber` parameter is the phone number of the user who will be making
 * the payment.
 * @param description - The `description` parameter is a string that describes the purpose or nature of
 * the payment. It can be used to provide additional information or context about the payment
 * transaction.
 * @returns the response data from the API call if the call is successful. If there is an error, it
 * returns an object with a status of "failed".
 */
async function pay(amount, tot_amnt, phoneNumber, description) {
    console.log(amount, tot_amnt, phoneNumber, description, )
    let response
    let callbackUrl = "https://sampleurl.com/callback"
    let senderEmail = "test@mail.com"
    let provider = "mtn"
    let channel = "mobile_money"
    
       // Generate a UUID and remove non-numeric characters
    let foreignID = uuidv4().replace(/\D/g, '');

    var config = {
        method: "POST",
        url: `https://api.junipayments.com/payment`,
        headers: {
            'cache-control': 'no-cache',
            'authorization': "Bearer " + getJuniCredentials().token,
            'clientid': getJuniCredentials().clientId
        },
        data: {
            amount: amount,
            tot_amnt: tot_amnt,
            provider: provider,
            phoneNumber: phoneNumber,
            channel: channel,
            senderEmail: senderEmail,
            description: description,
            foreignID: foreignID,
            callbackUrl: callbackUrl
        }
    };

    try {
        response = await axios(config);
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return {
            status: "failed"
        }
    }
}


module.exports = {
    verify,
    pay
}


