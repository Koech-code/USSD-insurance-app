require("dotenv").config();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const { PaymentResponse } = require("../models/paymentResponseModel");

/**
 * The function "getJuniCredentials" returns an object containing a token and a client ID.
 * @returns An object containing the token and clientId from Juni.
 */
function getJuniCredentials() {
  return {
    token: process.env.JUNIPAY_TOKEN,
    clientId: process.env.CLIENT_ID,
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
  let response;

  var config = {
    method: "GET",
    url: `https://api.junipayments.com/resolve?channel=mobile_money&phoneNumber=${telephoneNumber}`,
    headers: {
      "cache-control": "no-cache",
      authorization: "Bearer " + getJuniCredentials().token,
      clientid: getJuniCredentials().clientId,
    },
  };
  try {
    response = await axios(config);
    return response.data;
  } catch (err) {
    return {
      status: "failed",
    };
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
  console.log(amount, tot_amnt, phoneNumber, description);
  let response;
  let callbackUrl = "https://sampleurl.com/callback";
  let senderEmail = "test@mail.com";
  let provider = "mtn";
  let channel = "mobile_money";

  // Generate a UUID and remove non-numeric characters
  let foreignID = uuidv4().replace(/\D/g, "");

  var config = {
    method: "POST",
    url: `https://api.junipayments.com/payment`,
    headers: {
      "cache-control": "no-cache",
      authorization: "Bearer " + getJuniCredentials().token,
      clientid: getJuniCredentials().clientId,
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
      callbackUrl: callbackUrl,
    },
  };

  try {
    response = await axios(config);
    console.log(response.data);

    // Save the response in the database using Sequelize
    const savedResponse = await PaymentResponse.create({
      status: response.data.status,
      message: response.data.message,
      transactionID: response.data.transID,
      // Add other fields as needed
    });

    console.log(savedResponse.toJSON()); // Log the saved response details

    // Wait for 5 seconds before checking the status
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Make a new POST request to check the status
    const checkStatusConfig = {
      method: "POST",
      url: "https://api.junipayments.com/checktranstatus",
      headers: {
        "cache-control": "no-cache",
        authorization: "Bearer " + getJuniCredentials().token,
        clientid: getJuniCredentials().clientId,
        "content-type": "application/json",
      },
      data: {
        transID: response.data.transID,
      },
    };

    const statusCheckResponse = await axios(checkStatusConfig);
    const updatedStatus = statusCheckResponse.data.status;

    // Update the existing record in the database with the new status
    await PaymentResponse.update(
      { status: updatedStatus },
      { where: { transactionID: response.data.transID } }
    );

    console.log("Updated status:", updatedStatus);
    if (updatedStatus === "success") {
      try {
        // Assuming you have a function named verify that returns a Promise with user information
        let userName = await verify(phoneNumber);
        console.log("Name", userName.name);

        let message = `Dear ${userName.name},\n\n`;
        message += `Thank you for choosing Fast Insurance.`;

        const SEND_SMS_URL = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}=&to=${phoneNumber}&from=Flexible&sms=${message}`;

        // Make the GET request using Axios
        const response = await axios.get(SEND_SMS_URL);

        console.log("SMS Sent:", response.data.message);
      } catch (error) {
        console.error("Error sending SMS:", error.message);
      }
    }
    return response.data;
  } catch (err) {
    console.error("Error during payment request:", err);
    return {
      status: "failed",
      error: err.message, // Add more details if needed
    };
  }
}

module.exports = {
  verify,
  pay,
};
