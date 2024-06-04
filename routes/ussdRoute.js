const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const { PaymentResponse } = require("../models/paymentResponseModel");

require("dotenv").config();
const axios = require("axios");
const { secret } = require("../scripts/config.js");
const USSDCODE = "*928*311#";
const userSessionData = {};

let carNum = "";
let whatsappNum = "";
let itemNumber = "";
let ItemName = "";
let AmountSaveToDB = "";
let NumberToSave = "";
let ManufacturedYear = "" || null;

let InvoiceNo = "";
let ClientReferenceNumber = "";
let NumToSendSMS = "";

let DisplayAmount = "";

const processingFeePercentage = 3;

const ManufactureYear = "Please enter year of manufacture.";

const CarValueMessage = "Please enter the value of your car in GHC.";

async function verifyPhoneNumber(customerNumber) {
  if (
    customerNumber.startsWith("23324") ||
    customerNumber.startsWith("23325") ||
    customerNumber.startsWith("23354") ||
    customerNumber.startsWith("23355") ||
    customerNumber.startsWith("23359")
  ) {
    return "mtn-gh";
  } else if (
    customerNumber.startsWith("23320") ||
    customerNumber.startsWith("23350")
  ) {
    return "vodafone-gh";
  } else if (
    customerNumber.startsWith("23326") ||
    customerNumber.startsWith("23327") ||
    customerNumber.startsWith("23357")
  ) {
    return "tigo-gh";
  } else {
    return "Unknown";
  }
}

// Generate a unique ClientReference
const clientReference = uuidv4();

async function pay(amount, customerNumber, item_name, item_desc) {
  // Check if customerNumber starts with '0'
  if (customerNumber.startsWith("0")) {
    // Replace '0' with '233'
    customerNumber = "233" + customerNumber.slice(1);
  }
  console.log(amount, customerNumber, item_name, item_desc);
  ItemName = item_name;
  AmountSaveToDB = amount;
  NumberToSave = customerNumber;

  let response;
  let callback = "http://gblinsurancegh.com:5000/callback";
  
  let customerName = "name";

  // Dynamically determine payby
  let payby = await verifyPhoneNumber(customerNumber);

  var config = {
    method: "POST",
    url: `https://rmp.hubtel.com/merchantaccount/merchants/${process.env.HUBTEL_POS_SALES_ID}/receive/mobilemoney`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${process.env.AUTHORIZATION_KEY}`
    },
    data: {
      CustomerName: customerName,
      CustomerMsisdn: customerNumber,
      CustomerEmail: "recipient@gmail.com",
      Channel: payby,
      Amount: amount,
      PrimaryCallbackUrl: callback,
      Description: item_desc,
      ClientReference: clientReference,
      // username: process.env.HUBTEL_API_ID,
      // password: process.env.HUBTEL_API_KEY,
    },
  };

  try {
    console.log({ config });
    response = await axios(config);
    // await PaymentResponse.create({
    //   itemName: item_name,
    //   amount: amount,
    //   carnums: carNum,
    //   phoneNumber: customerNumber,
    //   whatsappnums: whatsappNum,
    //   // Adding status field with a specific value
    //   status: "pending", // Or you can omit this line to use the default value
    // });

    console.log("Payment Params - ", response.data);
    // InvoiceNo = response.data.InvoiceNo;
    ClientReferenceNumber = response.Data.ClientReference;
    // NumToSendSMS = customerNumber;
    // // Extract callback URL and customer number
    // const callbackUrl = response.data.callback;
    // const phoneNumber = response.data.customerNumber;

    // Call sendConfirmationMessage function
    // await sendConfirmationMessage(callbackUrl, phoneNumber);
  } catch (error) {
    console.error("Error occurred during payment:", error);
  }
}

const finalMessage = "You will receive a prompt to authorize payment of";
// Insurance Purchase prices
const miniBusServicePrices = {
  5: 633.0,
  6: 645.0,
  7: 657.0,
  8: 669.0,
  9: 681.0,
  10: 693.0,
  11: 705.0,
  12: 717.0,
  13: 729.0,
  14: 741.0,
  15: 753.0,
  16: 765.0,
  17: 777.0,
  18: 789.0,
  19: 801.0,
  20: 813.0,
  21: 825.0,
  22: 837.0,
};
// Third party co-orporate
const motorCycleServicePrices = {
  2: 243.0,
};
// Third party private prices
const privateIndividualX1Prices = {
  5: 468.0,
  6: 475.0,
  7: 482.0,
  8: 489.0,
  9: 496.0,
  10: 503.0,
  11: 510.0,
  12: 517.0,
};
const privateIndividualX4Prices = {
  5: 468.0,
  6: 480.0,
  7: 492.0,
  8: 504.0,
  9: 516.0,
  10: 528.0,
  11: 540.0,
  12: 552.0,
};
const ownGoodsBelow = {
  3: 643.0,
};
const ownGoodsAbove = {
  3: 648.0,
};
const generalGartageBelow = {
  3: 763.0,
};
const generalGartageAbove = {
  3: 763.0,
};

// Third party commercial prices
const maxBusServicePrices = {
  23: 849.0,
  24: 861.0,
  25: 873.0,
  26: 885.0,
  27: 897.0,
  28: 909.0,
  29: 921.0,
  30: 933.0,
  31: 945.0,
  32: 957.0,
  33: 969.0,
  34: 981.0,
  35: 993.0,
  36: 1005.0,
  37: 1017.0,
  38: 1029.0,
  39: 1041.0,
  40: 1053.0,
  41: 1065.0,
  42: 1077.0,
  43: 1089.0,
  44: 1101.0,
  45: 1113.0,
  46: 1125.0,
  47: 1137.0,
  48: 1149.0,
  49: 1161.0,
  50: 1173.0,
  51: 1185.0,
  52: 1197.0,
  53: 1209.0,
  54: 1221.0,
  55: 1233.0,
  56: 1245.0,
  57: 1257.0,
  58: 1269.0,
  59: 1281.0,
  60: 1293.0,
  61: 1305.0,
  62: 1317.0,
  63: 1329.0,
  64: 1341.0,
  65: 1353.0,
  66: 1365.0,
  67: 1377.0,
  68: 1389.0,
  69: 1401.0,
  70: 1413.0,
};
const hiringCarsServicePrices = {
  5: 633.0,
  6: 645.0,
  7: 657.0,
  8: 669.0,
  9: 681.0,
  10: 693.0,
  11: 705.0,
  12: 717.0,
  13: 729.0,
  14: 741.0,
  15: 753.0,
};
const ambulanceOrHearseServicePrices = {
  5: 503,
};

const artOrTankersServicePrices = {
  3: 903.0,
};
const taxiServicePrices = {
  5: 618.0,
};

// Insurance renewal prices
const maxBusRenewalServicePrices = {
  23: 722.0,
  24: 730.0,
  25: 738.0,
  26: 746.0,
  27: 754.0,
  28: 762.0,
  29: 770.0,
  30: 778.0,
  31: 786.0,
  32: 794.0,
  33: 802.0,
  34: 810.0,
  35: 818.0,
  36: 826.0,
  37: 834.0,
  38: 842.0,
  39: 850.0,
  40: 858.0,
  41: 866.0,
  42: 874.0,
  43: 882.0,
  44: 890.0,
  45: 898.0,
  46: 906.0,
  47: 914.0,
  48: 922.0,
  49: 930.0,
  50: 938.0,
  51: 946.0,
  52: 954.0,
  53: 962.0,
  54: 970.0,
  55: 978.0,
  56: 986.0,
  57: 994.0,
  58: 1002.0,
  59: 1010.0,
  60: 1018.0,
  61: 1026.0,
  62: 1034.0,
  63: 1042.0,
  64: 1050.0,
  65: 1058.0,
  66: 1066.0,
  67: 1074.0,
  68: 1082.0,
  69: 1090.0,
  70: 1098.0,
};
const hiringCarsRenewalServicePrices = {
  5: 578.0,
  6: 586.0,
  7: 594.0,
  8: 602.0,
  9: 610.0,
  10: 618.0,
  11: 626.0,
  12: 634.0,
  13: 642.0,
  14: 650.0,
  15: 658.0,
};
const ambulanceOrHearseRenewalServicePrices = {
  5: 458.0,
};
const artOrTankersRenewalServicePrices = {
  3: 853.0,
};
const taxiRenewalServicePrices = {
  5: 568.0,
};
const miniBusRenewalServicePrices = {
  5: 578.0,
  6: 586.0,
  7: 594.0,
  8: 602.0,
  9: 610.0,
  10: 618.0,
  11: 626.0,
  12: 634.0,
  13: 642.0,
  14: 650.0,
  15: 658.0,
  16: 666.0,
  17: 674.0,
  18: 682.0,
  19: 690.0,
  20: 698.0,
  21: 706.0,
  22: 714.0,
};
const privateIndividualX1RenewalPrices = {
  5: 423.0,
  6: 428.0,
  7: 433.0,
  8: 438.0,
  9: 443.0,
  10: 448.0,
  11: 453.0,
  12: 458.0,
};
const privateIndividualX4RenewalPrices = {
  5: 423.0,
  6: 431.0,
  7: 439.0,
  8: 447.0,
  9: 455.0,
  10: 463.0,
  11: 471.0,
  12: 479.0,
};
const ownGoodsBelowRenewalPrices = {
  3: 583.0,
};
const ownGoodsAboveRenewalPrices = {
  3: 598.0,
};

const generalCartageRenewalBelow = {
  3: 713.0,
};
const generalCartageRenewalAbove = {
  3: 723.0,
};
const motorCycleRenewalPrices = {
  2: 193,
};
// prices for step 5
const onSiteSpecialTypesServicePrice = {
  1: 353.0,
  2: 353.0,
  3: 353.0,
  4: 353.0,
  5: 353.0,
};
const onBoardSpecialTypesServicePrice = {
  1: 623.0,
  2: 623.0,
  3: 623.0,
  4: 623.0,
  5: 623.0,
};
const GW1Class1ServicePrice = {
  1: 508.0,
  2: 508.0,
  3: 508.0,
  4: 508.0,
  5: 508.0,
};
const GW1Class2ServicePrice = {
  1: 633.0,
  2: 633.0,
  3: 633.0,
  4: 633.0,
  5: 633.0,
};
const GW1Class3ServicePrice = {
  1: 788.0,
  2: 788.0,
  3: 788.0,
  4: 788.0,
  5: 788.0,
};

// Renewal prices for third party
const onSiteSpecialTypesRenewalServicePrice = {
  1: 323.0,
  2: 323.0,
  3: 323.0,
  4: 323.0,
  5: 323.0,
};
const onBoardSpecialTypesRenewalServicePrice = {
  1: 583.0,
  2: 583.0,
  3: 583.0,
  4: 583.0,
  5: 583.0,
};

const GW1Class1RenewalServicePrice = {
  1: 458.0,
  2: 458.0,
  3: 458.0,
  4: 458.0,
  5: 458.0,
};
const GW1Class2RenewalServicePrice = {
  1: 593.0,
  2: 593.0,
  3: 593.0,
  4: 593.0,
  5: 593.0,
};
const GW1Class3RenewalServicePrice = {
  1: 723.0,
  2: 723.0,
  3: 723.0,
  4: 723.0,
  5: 723.0,
};

router.post("/ussd", async (req, res) => {
  const { sessionID, newSession, msisdn, userData, userID, network } = req.body;
  console.log("Arkesel Response", req.body);

  let message = "";
  let service = "";
  let continueSession = "";
  let selectedOption = "";
  let type = "";
  let carPrice = "";
  let carPriceCompComm = "";
  let thirdPartyPrice = "";
  let GW1Options = "";
  let InsuranceType = "";
  let isThirdPartyComm = "";
  let specialAndGW1 = "";

  const caRegMessage = "Please enter your car registration number.";
  const whatsappMessage =
    "Please enter your Whatsapp phone number for communication.";
  const numberToPayWithMessage =
    "Please enter the phone number you wish to pay with.";

  if (newSession && userData === USSDCODE) {
    // Initial session setup
    userSessionData[sessionID] = {
      step: 1,
      amount: undefined,
      phoneNumber: undefined,
      phoneNumberComp: undefined,
      carRegNumber: undefined,
      whatsappNumber: undefined,
      itemNumber: undefined,
      YearOfManufacture: undefined,
    };
    message = "Welcome to Fast Insurance\n";
    message += "1. Purchase insurance\n";
    message += "2. Renew insurance\n";
    message += "3. Report accident\n";
    message += "4. Upload documents\n";
    message += "5. Promotions\n";
    continueSession = true;
  } else if (newSession === false && userSessionData[sessionID].step === 1) {
    userSessionData[sessionID].service = userData;
    if (userSessionData[sessionID].service === "1") {
      // Car type selection for Third Party
      service = "1";
      message = "Select a package to purchase\n";
      message += "1. 3rd party Comm.\n";
      message += "2. 3rd party Private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comp. Co-oporate\n";
      message += "5. Comp. Commercial\n";
      message += "6. Comp. Private\n";
      message += "00. HOME";
      continueSession = true;
      userSessionData[sessionID].InsuranceType = "purchase";
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "2") {
      // Renew insurance menu
      service = "2";
      message = "Select a package to renew\n";
      message += "1. 3rd party Comm.\n";
      message += "2. 3rd party Private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comp. Co-oprate\n";
      message += "5. Comp. Commercial\n";
      message += "6. Comp. Private";
      message += "00. HOME";
      continueSession = true;
      userSessionData[sessionID].InsuranceType = "renewal";
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "3") {
      service = "3";
      message =
        "Upload the picture of your car accident to WhatsApp Number: +233591539372. Thank you.";
      continueSession = false;
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "4") {
      // Send particulars
      service = "4";
      message =
        "Scan and Upload following Details to WhatsApp Number: +233591539372\n";
      message += "1. Driver’s License\n";
      message += "2. Car Picture\n";
      message += "3. DVLA/Road Worthy: inside cover\n";
      message += "4. Ghana Card/Voters & other Phone number";
      continueSession = false;
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "5") {
      // Send particulars
      service = "5";
      message = "Fast insurance promotions list\n";
      continueSession = false;
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    }
  } else if (newSession === false && userSessionData[sessionID].step === 2) {
    userSessionData[sessionID].service = userData;
    // Store the user's selection from step 2
    if (userSessionData[sessionID].service === "1") {
      // Car type selection for Third Party commercial
      service = "1";
      message = "1. Max Bus\n";
      message += "2. Hiring cars\n";
      message += "3. Ambulance/Hearse\n";
      message += "4. Special types\n";
      message += "5. GW1\n";
      message += "6. Art/Tankers\n";
      message += "7. Taxi\n";
      message += "8. Mini Bus\n";
      message += "0. BACK";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "2") {
      // Car type selection for Third Party private
      service = "2";
      message = "1. Private individual (X1)\n";
      message += "2. Private company (X4)\n";
      message += "3. Own goods(Below 3000 cc)\n";
      message += "4. Own goods(Above 3000 cc)\n";
      message += "5. General Cartage(Up to 3000 cc)\n";
      message += "6. General cartage(Above 3000 cc)\n";
      message += "7. Mini Bus\n";
      message += "0. BACK";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "3") {
      userSessionData[sessionID].selectedOption = userData;
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Car type selection for motor cycle
        service = "3";
        message =
          "You're about to purchase Motor Cycle (Private/Individual) insurance package. Please enter 2.\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "motorCycle";
        console.log("user selected", userData);
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        // Car type selection for motor cycle
        service = "3";
        message =
          "You're about to renew Motor Cycle (Private/Individual) insurance package. Choose option(Only 2 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "motorCycle";
        console.log("user selected", userData);
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      }
    } else if (userSessionData[sessionID].service === "4") {
      // Car type selection for motor cycle
      service = "4";
      message = "1. Motor Cycle\n";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "5") {
      // Car type selection for comprehensive commercial
      service = "5";
      message = "Please select your car type\n";
      message += "1. Max Bus\n";
      message += "2. Hiring cars\n";
      message += "3. Ambulance/Hearse\n";
      message += "4. Special types\n";
      message += "5. GW1\n";
      message += "6. Art/Tankers\n";
      message += "7. Taxi\n";
      message += "8. Mini Bus\n";
      message += "0. BACK";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "6") {
      // Car type selection for comprehensive private
      service = "6";
      message = "Please select your car type\n";
      message += "1. Private individual (X1)\n";
      message += "2. Private company (X4)\n";
      message += "3. Own goods(Below 3000 cc)\n";
      message += "4. Own goods(Above 3000 cc)";
      message += "5. General Cartage(Up to 3000 cc)\n";
      message += "6. General cartage(Above 3000 cc)\n";
      message += "0. BACK\n";
      // userSessionData[sessionID].carPrice = userData;
      // console.log("Price entered is", userSessionData[sessionID].carPrice);
      continueSession = true;
    } else if (userSessionData[sessionID].service === "00") {
      message = "Welcome to Fast Insurance\n";
      message += "1. Purchase insurance\n";
      message += "2. Renew insurance\n";
      message += "3. Report accident\n";
      message += "4. Upload documents\n";
      message += "5. Promotions\n";
      continueSession = true;
      userSessionData[sessionID].step = 0;
    }
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 3) {
    userSessionData[sessionID].selectedOption = userData;
    if (userSessionData[sessionID].service === "1") {
      // Additional logic for Third Party commercial - step 3
      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Logic for Special Types
          service = "1";
          message =
            "You're about to purchase max bus 3rd party insurance. Please enter the exact passenger capacity (between 23 - 70)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "maxBus";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Logic for Special Types
          service = "1";
          message =
            "You're about to renew Max bus 3rd party insurance package (23 - 70 persons). Enter the exact passenger capacity (e.g 23):\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "maxBus";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Handle choice 2 for Third Party commercial - step 3
          // Logic for Special Types
          service = "1";
          message =
            "You're about to purchase hiring cars 3rd party insurance. Please enter the exact passenger capacity (between 5 - 15 persons)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "hiringCars";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Handle choice 2 for Third Party commercial - step 3
          // Logic for Special Types
          service = "1";
          message =
            "You're about to renew your hiring cars 3rd party insurance package. Please enter the exact passenger capacity (between 5 - 15 persons)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "hiringCars";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Options for ambulance/hearse cars
          service = "1";
          message =
            "You're about to purchase Ambulance/Hearse 3rd party insurance package. Choose an option:\n";
          message += "1. 5 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "ambulanceOrHearse";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Options for ambulance/hearse cars
          service = "1";
          message =
            "You selected Ambulance/Hearse renewal. Choose an option:\n";
          message += "1. 5 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          userSessionData[sessionID].type = "ambulanceOrHearse";
          console.log("user selected", userData);
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "4") {
        service = "1";
        message = "You selected Special Types. Choose an option:\n";
        message += "1. Special Type (ON SITE)\n";
        message += "2. Special Type (ON ROAD)";
        // userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "specialTypes";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Logic for GW1
        service = "1";
        message = "You selected GW1. Choose an option:\n";
        message += "1. GW1 Class 1\n";
        message += "2. GW1 Class 2\n";
        message += "3. GW1 Class 3";
        userSessionData[sessionID].type = "GW1";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      } else if (userSessionData[sessionID].selectedOption === "6") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Logic for Special Types
          service = "1";
          message = "You selected art/tankers purchase. Choose an option:\n";
          message += "3 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "artOrTankers";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Logic for Special Types
          service = "1";
          message = "You selected art/tankers renewal. Choose an option:\n";
          message += "3 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "artOrTankers";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "7") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Logic for Special Types
          service = "1";
          message = "You selected taxi purchase. Choose an option:\n";
          message += "1. 5 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "taxi";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Logic for Special Types
          service = "1";
          message = "You selected taxi renewal. Choose an option:\n";
          message += "1. 5 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "taxi";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "8") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Logic for Special Types
          service = "1";
          message = "You selected Mini Bus purchase. Choose an option:\n";
          message += "1. 5 - 22 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "miniBus";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Logic for Special Types
          service = "1";
          message = "You selected Mini Bus renewal. Choose an option:\n";
          message += "1. 5 - 22 persons \n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "miniBus";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "0") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Back to purchase insurance menu
          service = "1";
          message = "Select a package to purchase\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oporate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private\n";
          message += "00. HOME";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Back to renew insurance menu
          service = "2";
          message = "Select a package to renew\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oprate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          message += "00. HOME";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        }
      }
    } else if (userSessionData[sessionID].service === "2") {
      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Handle choice 2 for Third Party commercial - step 3
          // Logic for Special Types
          service = "2";
          message =
            "You selected private individual (X1) purchase. Enter number of persons it can hold(between 5 - 12)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "privateIndividualX1";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Handle choice 2 for Third Party commercial - step 3
          // Logic for Special Types
          service = "2";
          message =
            "You selected private individual (X1) renewal. Enter number of persons it can hold(between 5 - 12)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "privateIndividualX1";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected private company (X4) purchase. Enter number of persons it carries(between 5 -12)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "privateIndividualX4";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected private company (X4) renewal. Enter number of persons it carries(between 5 -12)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "privateIndividualX4";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected own goods (BELOW 3000 cc) purchase. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "ownGoodsBelow";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected own goods (BELOW 3000 cc) renewal. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "ownGoodsBelow";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "4") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected own goods (ABOVE 3000 cc) purchase. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "ownGoodsAbove";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected own goods (ABOVE 3000 cc) renewal. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "ownGoodsAbove";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "5") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected general cartage (UP TO 3000 cc) purchase. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "generalCartageBelow";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected general cartage (UP TO 3000 cc) renewal. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "generalCartageBelow";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "6") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected general cartage (ABOVE 3000 cc) purchase. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);

          userSessionData[sessionID].type = "generalCartageAbove";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected general cartage (ABOVE 3000 cc) renewal. Enter it's capacity(3)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);

          userSessionData[sessionID].type = "generalCartageAbove";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "7") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "2";
          message =
            "You selected Mini Bus purchase. Enter it's capacity(between 5 - 22)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);

          userSessionData[sessionID].type = "miniBus";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "2";
          message =
            "You selected Mini Bus renewal. Enter it's capacity(between 5 - 22)\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);

          userSessionData[sessionID].type = "miniBus";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "0") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Back to purchase insurance menu
          service = "1";
          message = "Select a package to purchase\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oporate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Back to renew insurance menu
          service = "2";
          message = "Select a package to renew\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oprate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        }
      }
    } else if (userSessionData[sessionID].service === "3") {
      if (userSessionData[sessionID].type === "motorCycle") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = "Please enter your car registration number.";
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = "Please enter your car registration number.";
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].selectedOption === "1") {
        // Handle choice 1 for comprehensive co-oporate - step 3
        service = "4";
        message =
          "You selected motor cycle. Please enter the number of persons it holds( only 2 persons)\n";
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "motorCycle";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      }
    } else if (userSessionData[sessionID].service === "5") {
      if (userSessionData[sessionID].selectedOption === "1") {
        // Handle choice 1 for comprehensive private - step 3
        service = "6";
        message =
          "You selected Max Bus. Please enter the number of persons it holds( 23 - 70 persons)\n";
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "maxiBus";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for comprehensive private - step 3
        service = "6";
        message =
          "You selected hiring cars.Please enter the number of persons it holds( 5 - 15 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "hiring";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Handle choice 3 for comprehensive private - step 3
        service = "6";
        message =
          "You selected ambulance/hearse. Please enter the number of persons it holds(only 5 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "ambulance";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        service = "1";
        message = "You selected Special Types. Choose an option:\n";
        message += "1. Special Type (ON SITE)\n";
        message += "2. Special Type (ON ROAD)";
        // userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "specialTypes";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Logic for GW1
        service = "1";
        message = "You selected GW1. Choose an option:\n";
        message += "1. GW1 Class 1\n";
        message += "2. GW1 Class 2\n";
        message += "3. GW1 Class 3";
        userSessionData[sessionID].type = "GW1";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true;
      } else if (userSessionData[sessionID].selectedOption === "6") {
        // Handle choice 4 for comprehensive private - step 3
        service = "6";
        message =
          "You selected art/tankers. Please enter the number of persons it holds(Only 3 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "artOrTanker";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "7") {
        // Handle choice 4 for comprehensive private - step 3
        service = "6";
        message =
          "You selected taxi. Please enter the number of persons it holds(Only 5 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "Taxi";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "8") {
        // Handle choice 4 for comprehensive private - step 3
        service = "8";
        message =
          "You selected Mini Bus. Please enter the number of persons it holds(between 5 - 22 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "miniBus";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "0") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Back to purchase insurance menu
          service = "1";
          message = "Select a package to purchase\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oporate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Back to renew insurance menu
          service = "2";
          message = "Select a package to renew\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oprate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        }
      }
    } else if (userSessionData[sessionID].service === "6") {
      if (userSessionData[sessionID].selectedOption === "1") {
        // Handle choice 1 for comprehensive private - step 3
        service = "6";
        message =
          "You selected private individual (X1). Please enter the number of persons it holds( 5 - 12 persons)\n";
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "privateX1";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for comprehensive private - step 3
        service = "6";
        message =
          "You selected private company (X4).Please enter the number of persons it holds( 5 - 12 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "privateX4";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Handle choice 3 for comprehensive private - step 3
        service = "6";
        message =
          "You selected Own Goods (BELOW 3000 cc). Please enter the number of persons it holds(3 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "ownGoodsBelow3000";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        // Handle choice 4 for comprehensive private - step 3
        service = "6";
        message =
          "You selected Own Goods (ABOVE 3000 cc). Please enter the number of persons it holds(3 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "ownGoodsAbove3000";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Handle choice 4 for comprehensive private - step 3
        service = "6";
        message =
          "You selected General Cartage(BELOW 3000 cc). Please enter the number of persons it holds(3 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "generalCartageBelow3000";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "6") {
        // Handle choice 4 for comprehensive private - step 3
        service = "6";
        message =
          "You selected General Cartage(ABOVE 3000 cc). Please enter the number of persons it holds(3 persons)\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "generalCartageAbove3000";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "0") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Back to purchase insurance menu
          service = "1";
          message = "Select a package to purchase\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oporate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Back to renew insurance menu
          service = "2";
          message = "Select a package to renew\n";
          message += "1. 3rd party Comm.\n";
          message += "2. 3rd party Private\n";
          message += "3. Motor Cycle\n";
          message += "4. Comp. Co-oprate\n";
          message += "5. Comp. Commercial\n";
          message += "6. Comp. Private";
          continueSession = true;
          userSessionData[sessionID].step = 1;
        }
      }
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 4) {
    userSessionData[sessionID].selectedOption = userData;
    userSessionData[sessionID].phoneNumber = userData;
    userSessionData[sessionID].carRegNumber = userData;
    userSessionData[sessionID].itemNumber = userData;
    if (userSessionData[sessionID].service === "1") {
      // Check if the service is Third Party Commercial

      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Check if the selected option exists in the mapping
        if (userSessionData[sessionID].type === "maxBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "hiringCars") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "taxi") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "maxBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "hiringCars") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "taxi") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      }
      // step 4 for special types and GW1
      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].type === "specialTypes") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase Special Types(Z 802 ON SITE) 3rd party insurance package. Enter the exact passenger capacity(between 1 - 5)\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnSite";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew Special Types(Z 802 ON SITE) 3rd party insurance package. Enter the exact passenger number(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnSite";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        } else if (userSessionData[sessionID].type === "GW1") {
          service = "1";
          message =
            "You're about to purchase GW1(CLASS 1) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "GW1CLASS1";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].type === "specialTypes") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase Special Types(Z 802 ON ROAD) 3rd party package. Enter the exact passenger capacity(e.g 3)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnRoad";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew Special Types(Z 802 ON ROAD) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnRoad";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        } else if (userSessionData[sessionID].type === "GW1") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase GW1(CLASS 2) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS2";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew GW1(CLASS 2) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS2";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].type === "GW1") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase GW1(CLASS 3) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS3";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew GW1(CLASS 3) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS3";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        }
      }
    } else if (userSessionData[sessionID].service === "2") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else {
          message =
            "Invalid option selected for purchase of Third Party Private.";
          continueSession = false;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else {
          message =
            "Invalid option selected for renewal of Third Party Private.";
          continueSession = false;
        }
      } else {
        message = "Invalid option selected for Third Party Private.";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].service === "3") {
      if (userSessionData[sessionID].type === "motorCycle") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message =
            "Please enter your Whatsapp phone number for communication.";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message =
            "Please enter your Whatsapp phone number for communication.";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          // continueSession = true;
          message = caRegMessage;
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "5") {
      if (userSessionData[sessionID].type === "maxiBus") {
        service = "1";
        // message = "Please enter the phone number you wish to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "hiring") {
        service = "1";
        // message = "Please enter the phone number you wish to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ambulance") {
        service = "1";
        // message = "Please enter the phone number you wish to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "artOrTanker") {
        service = "1";
        // message = "Please enter the phone number you wish to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "Taxi") {
        service = "1";
        // message = "Please enter the phone number you wish to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "miniBus") {
        service = "1";
        // message = "Please enter the phone number you would like to pay with.";
        // userSessionData[sessionID].phoneNumberComp = userData;
        message = caRegMessage;
        continueSession = true;
      }

      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].type === "specialTypes") {
          service = "1";
          message =
            "You selected Special Types(Z 802 ON SITE) for comp. comm.. Choose an option:\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "specialOnSite";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].type === "GW1") {
          service = "1";
          message = "You selected GW1(CLASS 1). Choose an option:\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "GW1CLASS1";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].type === "specialTypes") {
          service = "1";
          message =
            "You selected Special Types(Z 802 ON ROAD). Choose an option:\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "specialOnRoad";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        } else if (userSessionData[sessionID].type === "GW1") {
          service = "1";
          message = "You selected GW1(CLASS 2). Choose an option:\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "GW1CLASS2";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].type === "GW1") {
          service = "1";
          message = "You selected GW1(CLASS 3). Choose an option:\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "GW1CLASS3";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      }
    } else if (userSessionData[sessionID].service === "6") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      if (userSessionData[sessionID].type === "privateX1") {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "privateX4") {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageBelow3000"
      ) {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageAbove3000"
      ) {
        service = "1";
        message = caRegMessage;
        continueSession = true;
      }
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 5) {
    // userSessionData[sessionID].thirdPartyPrice;
    userSessionData[sessionID].carPrice = userData;
    userSessionData[sessionID].phoneNumber = userData;

    userSessionData[sessionID].phoneNumberComp = userData;
    userSessionData[sessionID].whatsappNumber = userData;
    userSessionData[sessionID].carRegNumber = userData;
    // userSessionData[sessionID].itemNumber = userData;

    // Purchase prices for third party

    // copied from step 4
    if (userSessionData[sessionID].service === "1") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Check if the selected option exists in the mapping
        if (userSessionData[sessionID].type === "maxBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "hiringCars") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "taxi") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "maxBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "hiringCars") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "taxi") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      }
      // step 4 for special types and GW1
      if (userSessionData[sessionID].selectedOption === "1") {
        userSessionData[sessionID].itemNumber = userData;
        if (userSessionData[sessionID].type === "specialTypes") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're abouts to purchase Special Types(Z 802 ON SITE) 3rd party insurance package. Enter the exact passenger number(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnSite";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew Special Types(Z 802 ON SITE) 3rd party insurance package. Enter the exact passenger number(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnSite";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        } else if (userSessionData[sessionID].type === "GW1") {
          service = "1";
          message =
            "You're about to purchase GW1(CLASS 1) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
          message += "1. 1 - 5 persons\n";
          // Save the user's input as the selected option
          userSessionData[sessionID].selectedOption = userData;
          console.log("user selected", userData);
          userSessionData[sessionID].type = "GW1CLASS1";
          console.log(
            "user selected car type",
            userSessionData[sessionID].type
          );
          continueSession = true; // Set to true to continue the session
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].type === "specialTypes") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase Special Types(Z 802 ON ROAD) 3rd party package. Enter the exact passenger capacity(e.g 3)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnRoad";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew Special Types(Z 802 ON ROAD) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "specialOnRoad";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        } else if (userSessionData[sessionID].type === "GW1") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase GW1(CLASS 2) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS2";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew GW1(CLASS 2) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS2";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].type === "GW1") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase GW1(CLASS 3) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS3";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          } else if (userSessionData[sessionID].InsuranceType === "renewal") {
            service = "1";
            message =
              "You're about to renew GW1(CLASS 3) 3rd party package. Enter the exact passenger capacity(e.g 2)\n";
            message += "1. 1 - 5 persons\n";
            // Save the user's input as the selected option
            userSessionData[sessionID].selectedOption = userData;
            console.log("user selected", userData);
            userSessionData[sessionID].type = "GW1CLASS3";
            console.log(
              "user selected car type",
              userSessionData[sessionID].type
            );
            continueSession = true; // Set to true to continue the session
          }
        }
      }
    } else if (userSessionData[sessionID].service === "2") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else {
          message =
            "Invalid option selected for purchase of Third Party Private.";
          continueSession = false;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].type === "miniBus") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else {
          message =
            "Invalid option selected for renewal of Third Party Private.";
          continueSession = false;
        }
      } else {
        message = "Invalid option selected for Third Party Private.";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].service === "3") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        service = userSessionData[sessionID].service;
        whatsappNum = userSessionData[sessionID].whatsappNumber;
        let amount = 1;
        // add 3% of the amount as processing fee
        let tot_amt = (processingFeePercentage / 100) * amount + amount;
        await pay(
          tot_amt,
          req.body.msisdn,
          "Motor Cylce 2-seater",
          "Buy Motor Cycle 2 persons."
        );

        message = `${finalMessage} ` + `${tot_amt}` + ` now.`;
        continueSession = false;
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        service = userSessionData[sessionID].service;

        let amount = 193;
        // add 3% of the amount as processing fee
        let tot_amt = (processingFeePercentage / 100) * amount + amount;

        await pay(
          tot_amt,
          userSessionData[sessionID].msisdn,
          "Motor Cycle 2-seater",
          "Renew Motor Cycle 2 persons."
        );

        message = `${finalMessage} ` + `${tot_amt}` + ` now.`;
        continueSession = false;
      }
    } else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = userSessionData[sessionID].service;
          message = whatsappMessage;
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "5") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      if (userSessionData[sessionID].type === "maxiBus") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "hiring") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
      } else if (userSessionData[sessionID].type === "ambulance") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "artOrTanker") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "Taxi") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "miniBus") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      }
      // }

      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          if (userSessionData[sessionID].type === "specialOnSite") {
            // Check if the selected option exists in the mapping
            if (
              onSiteSpecialTypesServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                onSiteSpecialTypesServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          } else if (userSessionData[sessionID].type === "GW1CLASS1") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class1ServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class1ServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (userSessionData[sessionID].type === "specialOnSite") {
            // Check if the selected option exists in the mapping
            if (
              onSiteSpecialTypesRenewalServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                onSiteSpecialTypesRenewalServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          } else if (userSessionData[sessionID].type === "GW1CLASS1") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class1RenewalServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class1RenewalServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        }
      } else if (userSessionData[sessionID].selectedOption === "2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          if (userSessionData[sessionID].type === "specialOnRoad") {
            // Check if the selected option exists in the mapping
            if (
              onBoardSpecialTypesServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                onBoardSpecialTypesServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          } else if (userSessionData[sessionID].type === "GW1CLASS2") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class2ServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class2ServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (userSessionData[sessionID].type === "specialOnRoad") {
            // Check if the selected option exists in the mapping
            if (
              onBoardSpecialTypesRenewalServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                onBoardSpecialTypesRenewalServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          } else if (userSessionData[sessionID].type === "GW1CLASS2") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class2RenewalServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class2RenewalServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        }
      } else if (userSessionData[sessionID].selectedOption === "3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          if (userSessionData[sessionID].type === "GW1CLASS3") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class3ServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class3ServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (userSessionData[sessionID].type === "GW1CLASS3") {
            // Check if the selected option exists in the mapping
            if (
              GW1Class3RenewalServicePrice.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              message =
                CarValueMessage;
              userSessionData[sessionID].thirdPartyPrice =
                GW1Class3RenewalServicePrice[
                  userSessionData[sessionID].selectedOption
                ].toFixed(2);
              continueSession = true;
            }
          }
        }
      }
    } else if (userSessionData[sessionID].service === "6") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      if (userSessionData[sessionID].type === "privateX1") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "privateX4") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageBelow3000"
      ) {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageAbove3000"
      ) {
        service = userSessionData[sessionID].service;
        message = whatsappMessage;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      }
    }
    // for 3rd party commercial
    if (userSessionData[sessionID].service === "1") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = caRegMessage;
          userSessionData[sessionID].isThirdPartyComm = "thirdPartyComm";
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          service = "1";
          message = caRegMessage;
          continueSession = true;
        }
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 6) {
    userSessionData[sessionID].thirdPartyPrice;
    userSessionData[sessionID].carPrice = userData;

    userSessionData[sessionID].phoneNumber = userData;
    userSessionData[sessionID].phoneNumberComp;
    userSessionData[sessionID].whatsappNumber = userData;
    userSessionData[sessionID].carRegNumber = userData;

    const numberToPayWithMessage =
      "Please enter the phone number you wish to pay with.";
      whatsappNum = userSessionData[sessionID].whatsappNumber;
    if (userSessionData[sessionID].service === "1") {
      
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // if (userSessionData[sessionID].type === "maxBus") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "hiringCars") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "artOrTankers") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "taxi") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "miniBus") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // }
        if (userSessionData[sessionID].type === "maxBus") {
          const timeoutDuration = 300000; // Set your desired timeout duration in milliseconds (e.g., 5000 milliseconds = 5 seconds)

          try {
            if (
              maxBusServicePrices.hasOwnProperty(
                userSessionData[sessionID].selectedOption
              )
            ) {
              service = userSessionData[sessionID].service;
              // Get the price dynamically from the mapping
              let amount = parseInt(
                maxBusServicePrices[userSessionData[sessionID].selectedOption]
              );

              // add 3% of the amount as processing fee
              let tot_amt = (processingFeePercentage / 100) * amount + amount;

              const paymentPromise = await pay(
                tot_amt,
                req.body.msisdn,
                "Third-party Max Bus " + userSessionData[sessionID].itemNumber,
                "Buy Max Bus 3rd-party."
              );

              // Set a timeout for the payment operation
              await Promise.race([
                paymentPromise,
                new Promise((_, reject) =>
                  setTimeout(
                    () => reject(new Error("Payment operation timed out")),
                    timeoutDuration
                  )
                ),
              ]);

              // Inform the user about the payment prompt
              message = `${finalMessage} ${tot_amt.toFixed(2)} now!`;
              continueSession = false;
            } else {
              message =
                "Only numbers between 23 - 70 are allowed. Back to step 3 and re-enter.";
              continueSession = false;
            }
          } catch (error) {
            message = "Error processing payment: " + error.message;
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "hiringCars") {
          if (
            hiringCarsServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              hiringCarsServicePrices[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Hiring Car " + userSessionData[sessionID].itemNumber,
              "Buy Hiring car 3rd-party."
            );

            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only numbers between 5 - 15 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          if (
            ambulanceOrHearseServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ambulanceOrHearseServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Ambulance/Hearse " +
                userSessionData[sessionID].itemNumber,
              "Buy Ambulance/hearse 3rd-party"
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5 to access this service.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          if (
            artOrTankersServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              artOrTankersServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Art/Tankers " +
                userSessionData[sessionID].itemNumber,
              "Buy Art/Tankers 3rd-party"
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 3.";
          }
        } else if (userSessionData[sessionID].type === "taxi") {
          if (
            taxiServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              taxiServicePrices[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Taxi " + userSessionData[sessionID].itemNumber,
              "Buy Taxi car 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          if (
            miniBusServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              miniBusServicePrices[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Mini Bus " + userSessionData[sessionID].itemNumber,
              "Buy Mini Bus 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        // if (userSessionData[sessionID].type === "maxBus") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "hiringCars") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "artOrTankers") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "taxi") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].type === "miniBus") {
        //   message = numberToPayWithMessage;
        //   whatsappNum = userSessionData[sessionID].whatsappNumber;
        //   continueSession = true;
        // }
        if (userSessionData[sessionID].type === "maxBus") {
          if (
            maxBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              maxBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Max Bus " + userSessionData[sessionID].itemNumber,
              "Renew Max Bus 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only numbers between 23 - 70 are allowed.";
          }
        } else if (userSessionData[sessionID].type === "hiringCars") {
          if (
            hiringCarsRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              hiringCarsRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Hiring car " + userSessionData[sessionID].itemNumber,
              "Renew Hiring car 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only numbers between 5 - 15 are allowed.";
          }
        } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
          if (
            ambulanceOrHearseRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ambulanceOrHearseRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Ambulance/Hearse " +
                userSessionData[sessionID].itemNumber,
              "Renew Ambu/Hearse 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5 to access this service.";
          }
        } else if (userSessionData[sessionID].type === "artOrTankers") {
          if (
            artOrTankersRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              artOrTankersRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Art/Tanker " + userSessionData[sessionID].itemNumber,
              "Renew Art/Tanker 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 3.";
          }
        } else if (userSessionData[sessionID].type === "taxi") {
          if (
            taxiRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              taxiRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Taxi " + userSessionData[sessionID].itemNumber,
              "Renew Taxi car 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          if (
            miniBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              miniBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Mini Bus " + userSessionData[sessionID].itemNumber,
              "Renew Mini Bus 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        }
      }
    } else if (userSessionData[sessionID].service === "2") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      //   // Check if the service is Third Party Private
      //   if (userSessionData[sessionID].type === "privateIndividualX1") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "privateIndividualX4") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "generalCartageBelow") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "generalCartageAbove") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "miniBus") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else {
      //     message =
      //       "Invalid option selected for purchase of Third Party Private.";
      //     continueSession = false;
      //   }
      // } else if (userSessionData[sessionID].InsuranceType === "renewal") {
      //   // Check if the service is Third Party Private
      //   if (userSessionData[sessionID].type === "privateIndividualX1") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "privateIndividualX4") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "generalCartageBelow") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "generalCartageAbove") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "miniBus") {
      //     message = numberToPayWithMessage;
      //     whatsappNum = userSessionData[sessionID].whatsappNumber;
      //     continueSession = true;
      //   } else {
      //     message =
      //       "Invalid option selected for renewal of Third Party Private.";
      //     continueSession = false;
      //   }
      // } else {
      //   message = "Invalid option selected for Third Party Private.";
      //   continueSession = false;
      // }
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX1Prices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            let amount = parseInt(
              privateIndividualX1Prices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Private Individual X1 " +
                userSessionData[sessionID].itemNumber,
              "Buy Pvt Indiv X1 3rd-party."
            );
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX4Prices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              privateIndividualX4Prices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Private Individual X4 " +
                userSessionData[sessionID].itemNumber,
              "Buy Pvt Indiv X4 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ownGoodsBelow[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Own Goods(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Own Goods(<3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ownGoodsAbove[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Own Goods(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Own Goods(>3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          // Check if the selected option exists in the mapping
          if (
            generalGartageBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              generalGartageBelow[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party General Cartage(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Gen.Gar (<3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          // Check if the selected option exists in the mapping
          if (
            generalGartageAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              generalGartageAbove[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party General Cartage(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Gen.Gar (>3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          // Check if the selected option exists in the mapping
          if (
            miniBusServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              miniBusServicePrices[userSessionData[sessionID].selectedOption]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "Third-party Mini Bus " + userSessionData[sessionID].itemNumber,
              "Buy Mini Bus 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input a value between 5 - 22.";
          }
        } else {
          message =
            "Invalid option selected for purchase of Third Party Private.";
          continueSession = false;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        // Check if the service is Third Party Private
        if (userSessionData[sessionID].type === "privateIndividualX1") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX1RenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              privateIndividualX1RenewalPrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private Private Individual X1 " +
                userSessionData[sessionID].itemNumber,
              "Renew Pvt Indiv X1 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX4RenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              privateIndividualX4RenewalPrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private Private Individual X4 " +
                userSessionData[sessionID].itemNumber,
              "Renew Pvt Indiv X4 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsBelowRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ownGoodsBelowRenewalPrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private Own Goods(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Own Goods(<3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "ownGoodsAbove") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsAboveRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              ownGoodsAboveRenewalPrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private Own Goods(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Own Goods(>3,000 cc) 3rd-party."
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "generalCartageBelow") {
          // Check if the selected option exists in the mapping
          if (
            generalCartageRenewalBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              generalCartageRenewalBelow[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private General Cartage(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Gen.Gar (<3,000 cc)"
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "generalCartageAbove") {
          // Check if the selected option exists in the mapping
          if (
            generalCartageRenewalAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              generalCartageRenewalAbove[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private General Cartage(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Gen.Gar (>3,000 cc)"
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Input 3 to access this service";
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          // Check if the selected option exists in the mapping
          if (
            miniBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            let amount = parseInt(
              miniBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ]
            );
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;

            await pay(
              tot_amt,
              req.body.msisdn,
              "3rd-party-private Mini Bus " +
                userSessionData[sessionID].itemNumber,
              "Renew Mini Bus 3rd-party"
            );
            // Get the price dynamically from the mapping
            message = `${finalMessage} ` + tot_amt + ` now.`;
            continueSession = false;
          } else {
            message = "Please input a value between 5 - 22.";
          }
        } else {
          message =
            "Invalid option selected for renewal of Third Party Private.";
          continueSession = false;
        }
      } else {
        message = "Invalid option selected for Third Party Private.";
        continueSession = false;
      }
    }  
    else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          // Check if the selected option exists in the mapping
          if (
            motorCycleServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message = "Please enter the value of your motor cycle.";
            userSessionData[sessionID].thirdPartyPrice =
              motorCycleServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);

            whatsappNum = userSessionData[sessionID].whatsappNumber;
            console.log(
              "Car price is: ",
              userSessionData[sessionID].thirdPartyPrice
            );
            continueSession = true;
          }
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          // Check if the selected option exists in the mapping
          if (
            motorCycleRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message = "Please enter the value of your motor cycle.";
            userSessionData[sessionID].thirdPartyPrice =
              motorCycleRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            console.log(
              "Car price is: ",
              userSessionData[sessionID].thirdPartyPrice
            );
            continueSession = true;
          }
        }
      }
    } else if (userSessionData[sessionID].service === "5") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (userSessionData[sessionID].type === "maxiBus") {
          // Check if the selected option exists in the mapping
          if (
            maxBusServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              maxBusServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);

            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "hiring") {
          // Check if the selected option exists in the mapping
          if (
            hiringCarsServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              hiringCarsServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);

            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ambulance") {
          // Check if the selected option exists in the mapping
          if (
            ambulanceOrHearseServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ambulanceOrHearseServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "artOrTanker") {
          // Check if the selected option exists in the mapping
          if (
            artOrTankersServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              artOrTankersServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "Taxi") {
          // Check if the selected option exists in the mapping
          if (
            taxiServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              taxiServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);

            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          // Check if the selected option exists in the mapping
          if (
            miniBusServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              miniBusServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);

            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "maxiBus") {
          // Check if the selected option exists in the mapping
          if (
            maxBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              maxBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "hiring") {
          // Check if the selected option exists in the mapping
          if (
            hiringCarsRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              hiringCarsRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ambulance") {
          // Check if the selected option exists in the mapping
          if (
            ambulanceOrHearseRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ambulanceOrHearseRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "artOrTanker") {
          // Check if the selected option exists in the mapping
          if (
            artOrTankersRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              artOrTankersRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "Taxi") {
          // Check if the selected option exists in the mapping
          if (
            taxiRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              taxiRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "miniBus") {
          // Check if the selected option exists in the mapping
          if (
            miniBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              miniBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        }
      }
      // collect phone number from user
      if (userSessionData[sessionID].type === "specialOnSite") {
        service = "1";
        message = caRegMessage;
        userSessionData[sessionID].carPriceCompComm = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        service = "1";
        message = caRegMessage;
        userSessionData[sessionID].carPriceCompComm = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        service = "1";
        message = caRegMessage;
        userSessionData[sessionID].carPriceCompComm = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        service = "1";
        message = caRegMessage;
        userSessionData[sessionID].carPriceCompComm = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        service = "1";
        message = caRegMessage;
        userSessionData[sessionID].carPriceCompComm = userData;
        continueSession = true;
      }
    } else if (userSessionData[sessionID].service === "6") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (userSessionData[sessionID].type === "privateX1") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX1Prices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX1Prices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "privateX4") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX4Prices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX4Prices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsBelow[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsAbove[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (
          userSessionData[sessionID].type === "generalCartageBelow3000"
        ) {
          // Check if the selected option exists in the mapping
          if (
            generalGartageBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              generalGartageBelow[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (
          userSessionData[sessionID].type === "generalCartageAbove3000"
        ) {
          // Check if the selected option exists in the mapping
          if (
            generalGartageAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              generalGartageAbove[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "privateX1") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX1RenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX1RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "privateX4") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX4RenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX4RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsBelowRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsBelowRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsAboveRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsAboveRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (
          userSessionData[sessionID].type === "generalCartageBelow3000"
        ) {
          // Check if the selected option exists in the mapping
          if (
            generalCartageRenewalBelow.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              generalCartageRenewalBelow[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        } else if (
          userSessionData[sessionID].type === "generalCartageAbove3000"
        ) {
          // Check if the selected option exists in the mapping
          if (
            generalCartageRenewalAbove.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              CarValueMessage;
            userSessionData[sessionID].thirdPartyPrice =
              generalCartageRenewalAbove[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            whatsappNum = userSessionData[sessionID].whatsappNumber;
            continueSession = true;
          }
        }
      }
    }
    // End of copy

    if (userSessionData[sessionID].service === "1") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yeSpecialOnSite";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yeSpecialOnSite";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yeSpecialOnRoad";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yeSpecialOnRoad";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class1";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class1";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class2";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class2";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class3";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          message = whatsappMessage;
          userSessionData[sessionID].specialAndGW1 = "yesGW1Class3";
          carNum = userSessionData[sessionID].carRegNumber;
          continueSession = true;
        }
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 7) {
    userSessionData[sessionID].phoneNumber = userData;
    userSessionData[sessionID].whatsappNumber = userData;

    userSessionData[sessionID].carRegNumber = userData;
    userSessionData[sessionID].thirdPartyPrice;

    userSessionData[sessionID].carRegNumber = userData;
    userSessionData[sessionID].carPrice = userData;

     if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        // if (userSessionData[sessionID].InsuranceType === "purchase") {
        //   message = numberToPayWithMessage;
        //   userSessionData[sessionID].carPrice = userData;
        //   continueSession = true;
        // } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        //   message = numberToPayWithMessage;
        //   userSessionData[sessionID].carPrice = userData;
        //   continueSession = true;
        // }
        if (userSessionData[sessionID].InsuranceType === "purchase") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Co-orporate Motor Cycle " +
              userSessionData[sessionID].itemNumber,
            "Buy a Motor Cycle car insur."
          );

          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }
        console.log(
          "Motor cycle is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);
        console.log(
          "Total amount to be paid for comprehensive co-oporate motor cycle is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Co-orporate Motor Cycle " +
              userSessionData[sessionID].itemNumber,
            "Renewing a Motor Cycle car."
          );

          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }
        console.log(
          "Motor cycle is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);
        console.log(
          "Total amount to be paid for comprehensive co-oporate motor cycle is",
          DisplayAmount
        );
        continueSession = false;
      }
      }
    } else if (userSessionData[sessionID].service === "5") {
      userSessionData[sessionID].carPrice = userData;
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      if (userSessionData[sessionID].type === "maxiBus") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "hiring") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ambulance") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "artOrTanker") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "Taxi") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "miniBus") {
        message = ManufactureYear;
        // userSessionData[sessionID].carPrice = userData;
        continueSession = true;
      }
      if (userSessionData[sessionID].type === "specialOnSite") {
        service = userSessionData[sessionID].service;
        // message = whatsappMessage;
        message = ManufactureYear;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        // const totalPrice =
        //   parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
        //   parseInt(userSessionData[sessionID].thirdPartyPrice);
        // if (userSessionData[sessionID].carPrice < 50000) {
        //   message = "The car value cannot be less than 50000 GHS";
        // } else {
        //   // message = `Pay ${totalPrice}`;
        //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
        //   let amount = totalPrice;
        //   await pay(
        //     amount,
        //     userSessionData[sessionID].phoneNumber,
        //     "Buy spc(ON ROAD) comp. comm"
        //   );
        // }
        // console.log(
        //   "3rd party price is ",
        //   userSessionData[sessionID].thirdPartyPrice
        // );
        // console.log("And car value is", userSessionData[sessionID].carPrice);

        // console.log(
        //   "Total amount to be paid for comprehensive commercial special type (ON ROAD) is",
        //   totalPrice
        // );
        // continueSession = false;
        service = userSessionData[sessionID].service;
        // message = whatsappMessage;
        // carNum = userSessionData[sessionID].carRegNumber;
        message = ManufactureYear;
        carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        // const totalPrice =
        //   parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
        //   parseInt(userSessionData[sessionID].thirdPartyPrice);
        // if (userSessionData[sessionID].carPrice < 50000) {
        //   message = "The car value cannot be less than 50000 GHS";
        // } else {
        //   // message = `Pay ${totalPrice}`;
        //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
        //   let amount = totalPrice;
        //   await pay(
        //     amount,
        //     userSessionData[sessionID].phoneNumber,
        //     "Buy GW1(CLASS 1) comp. comm"
        //   );
        // }

        // console.log(
        //   "3rd party price is ",
        //   userSessionData[sessionID].thirdPartyPrice
        // );
        // console.log("And car value is", userSessionData[sessionID].carPrice);

        // console.log(
        //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
        //   totalPrice
        // );
        // continueSession = false;

        service = userSessionData[sessionID].service;
        // message = whatsappMessage;
        message = ManufactureYear;
        carNum = userSessionData[sessionID].carRegNumber;
        // carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        // const totalPrice =
        //   parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
        //   parseInt(userSessionData[sessionID].thirdPartyPrice);
        // if (userSessionData[sessionID].carPrice < 50000) {
        //   message = "The car value cannot be less than 50000 GHS";
        // } else {
        //   // message = `Pay ${totalPrice}`;
        //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
        //   let amount = totalPrice;
        //   await pay(
        //     amount,
        //     userSessionData[sessionID].phoneNumber,
        //     "Buy GW1(CLASS 2) comp. comm"
        //   );
        // }

        // console.log(
        //   "3rd party price is ",
        //   userSessionData[sessionID].thirdPartyPrice
        // );
        // console.log("And car value is", userSessionData[sessionID].carPrice);

        // console.log(
        //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
        //   totalPrice
        // );
        // continueSession = false;

        service = userSessionData[sessionID].service;
        message = ManufactureYear;
        carNum = userSessionData[sessionID].carRegNumber;
        // message = whatsappMessage;
        // carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        // const totalPrice =
        //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
        //   parseInt(userSessionData[sessionID].thirdPartyPrice);
        // if (userSessionData[sessionID].carPrice < 50000) {
        //   message = "The car value cannot be less than 50000 GHS";
        // } else {
        //   // message = `Pay ${totalPrice}`;
        //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
        //   let amount = totalPrice;
        //   await pay(
        //     amount,
        //     userSessionData[sessionID].phoneNumber,
        //     "Buy GW1(CLASS 3) comp. comm"
        //   );
        // }

        // console.log(
        //   "3rd party price is ",
        //   userSessionData[sessionID].thirdPartyPrice
        // );
        // console.log("And car value is", userSessionData[sessionID].carPrice);

        // console.log(
        //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
        //   totalPrice
        // );
        // continueSession = false;

        service = userSessionData[sessionID].service;
        message = ManufactureYear;
        carNum = userSessionData[sessionID].carRegNumber;
        // message = whatsappMessage;
        // carNum = userSessionData[sessionID].carRegNumber;
        continueSession = true;
      }
      // } else if (userSessionData[sessionID].service === "renewal") {
      // if (userSessionData[sessionID].type === "maxiBus") {
      //   message = numberToPayWithMessage;
      //   userSessionData[sessionID].carPrice = userData;
      //   continueSession = true;
      // }
      // }
    } else if (userSessionData[sessionID].service === "6") {
      userSessionData[sessionID].carPrice = userData;
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (userSessionData[sessionID].type === "privateX1") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive-Prvt Private Individual X1 " +
                userSessionData[sessionID].itemNumber,
              "Buy indv X1 comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private individual X1 is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "privateX4") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Private Individual X4 " +
                userSessionData[sessionID].itemNumber,
              "Buy indv X4 comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private individual X4 is",
            DisplayAmount
          );
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Own Goods(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Own Goods(<3,000) comp. pvt"
            );
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private own goods below 3000 cc is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Own Goods(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Own.G (>3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private Own Goods (ABOVE 3000 cc) is",
            DisplayAmount
          );
          continueSession = false;
        } else if (
          userSessionData[sessionID].type === "generalCartageBelow3000"
        ) {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt General Cartage(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Gen.Crt (<3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private General Cartage (BELOW 3000 cc) is",
            totalPrice
          );
          continueSession = false;
        } else if (
          userSessionData[sessionID].type === "generalCartageAbove3000"
        ) {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt General Cartage(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Buy Gen.Crt (>3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private General Cartage (ABOVE 3,000 cc) is",
            totalPrice
          );
          continueSession = false;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "privateX1") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive-Prvt Private Individual X1 " +
                userSessionData[sessionID].itemNumber,
              "Renew indv X1 comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private individual X1 is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "privateX4") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Private Individual X4 " +
                userSessionData[sessionID].itemNumber,
              "Renew indv X4 comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private individual X4 is",
            DisplayAmount
          );
          continueSession = true;
        } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Own Goods(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Own Goods(<3,000) comp. pvt"
            );
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private own goods below 3000 cc is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt Own Goods(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Own.G (>3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private Own Goods (ABOVE 3000 cc) is",
            DisplayAmount
          );
          continueSession = false;
        } else if (
          userSessionData[sessionID].type === "generalCartageBelow3000"
        ) {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt General Cartage(Below 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Gen.Crt (<3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private General Cartage (BELOW 3000 cc) is",
            totalPrice
          );
          continueSession = false;
        } else if (
          userSessionData[sessionID].type === "generalCartageAbove3000"
        ) {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive-Prvt General Cartage(Above 3,000 cc) " +
                userSessionData[sessionID].itemNumber,
              "Renew Gen.Crt (>3,000) comp. pvt"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive private General Cartage (ABOVE 3,000 cc) is",
            totalPrice
          );
          continueSession = false;
        }
      }
    }
    if (userSessionData[sessionID].specialAndGW1 === "yeSpecialOnSite") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (
          onSiteSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            onSiteSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party Special Types(ON SITE) " +
              userSessionData[sessionID].itemNumber,
            "Buy spc(ON SITE) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (
          onSiteSpecialTypesRenewalServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            onSiteSpecialTypesRenewalServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party Special Types(ON SITE) " +
              userSessionData[sessionID].itemNumber,
            "Renew spc(ON SITE) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    } else if (userSessionData[sessionID].specialAndGW1 === "yeSpecialOnRoad") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (
          onBoardSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            onBoardSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party Special Types(ON ROAD) " +
              userSessionData[sessionID].itemNumber,
            "Buy spc(ON ROAD) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (
          onBoardSpecialTypesRenewalServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            onBoardSpecialTypesRenewalServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party Special Types(ON ROAD) " +
              userSessionData[sessionID].itemNumber,
            "Renew spc(ON ROAD) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    } else if (userSessionData[sessionID].specialAndGW1 === "yesGW1Class1") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (
          GW1Class1ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class1ServicePrice[userSessionData[sessionID].selectedOption]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 1) " + userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 1) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (
          GW1Class1RenewalServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class1RenewalServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 1) " + userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 1) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    } else if (userSessionData[sessionID].specialAndGW1 === "yesGW1Class2") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (
          GW1Class2ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class2ServicePrice[userSessionData[sessionID].selectedOption]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 2) " + userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 2) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (
          GW1Class2RenewalServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class2RenewalServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 2) " + userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 2) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    } else if (userSessionData[sessionID].specialAndGW1 === "yesGW1Class3") {
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (
          GW1Class3ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class3ServicePrice[userSessionData[sessionID].selectedOption]
          );

          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 3) " + userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 3) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (
          GW1Class3RenewalServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          let amount = parseInt(
            GW1Class3RenewalServicePrice[
              userSessionData[sessionID].selectedOption
            ]
          );
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          await pay(
            tot_amt,
            req.body.msisdn,
            "3rd-party GW1(CLASS 3) " + userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 3) 3rd-party"
          );
          message = `${finalMessage} ` + tot_amt + ` now `;
          continueSession = false;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 8) {
    // userSessionData[sessionID].thirdPartyPrice;
    // userSessionData[sessionID].carPrice = userData;

    userSessionData[sessionID].phoneNumber = userData;
    userSessionData[sessionID].phoneNumberComp;

    userSessionData[sessionID].whatsappNumber = userData;

    userSessionData[sessionID].YearOfManufacture = userData;
    // userSessionData[sessionID].whatsappNumber = userData;
    if (userSessionData[sessionID].type === "motorCycle") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     let amount = totalPrice;
      //     // add 3% of the amount as processing fee
      //     let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //     DisplayAmount = tot_amt;
      //     await pay(
      //       tot_amt,
      //       userSessionData[sessionID].phoneNumber,
      //       "Comprehensive Co-orporate Motor Cycle " +
      //         userSessionData[sessionID].itemNumber,
      //       "Buy a Motor Cycle car insur."
      //     );

      //     // message = `Pay ${totalPrice}`;
      //     message = `${finalMessage} ` + tot_amt + ` now `;
      //   }
      //   console.log(
      //     "Motor cycle is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);
      //   console.log(
      //     "Total amount to be paid for comprehensive co-oporate motor cycle is",
      //     DisplayAmount
      //   );
      //   continueSession = false;
      // } else if (userSessionData[sessionID].InsuranceType === "renewal") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     let amount = totalPrice;
      //     // add 3% of the amount as processing fee
      //     let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //     DisplayAmount = tot_amt;
      //     await pay(
      //       tot_amt,
      //       userSessionData[sessionID].phoneNumber,
      //       "Comprehensive Co-orporate Motor Cycle " +
      //         userSessionData[sessionID].itemNumber,
      //       "Renewing a Motor Cycle car."
      //     );

      //     // message = `Pay ${totalPrice}`;
      //     message = `${finalMessage} ` + tot_amt + ` now `;
      //   }
      //   console.log(
      //     "Motor cycle is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);
      //   console.log(
      //     "Total amount to be paid for comprehensive co-oporate motor cycle is",
      //     DisplayAmount
      //   );
      //   continueSession = false;
      // }
    } else if (userSessionData[sessionID].service === "5") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      // if (userSessionData[sessionID].type === "maxiBus") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;

      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Max Bus " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Max Bus comp. comm"
      //   //   );

      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log(
      //   //   "3rd party price is ",
      //   //   userSessionData[sessionID].thirdPartyPrice
      //   // );
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial maxi bus is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;
      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // } else if (userSessionData[sessionID].type === "hiring") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;
      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Hiring Car " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Hiring car comp. comm"
      //   //   );

      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log(
      //   //   "3rd party price is ",
      //   //   userSessionData[sessionID].thirdPartyPrice
      //   // );
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial hiring cars is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;

      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // } else if (userSessionData[sessionID].type === "ambulance") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;
      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     // userSessionData[sessionID].phoneNumberComp,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Ambulance/Hearse " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Ambul/Hearse comp. comm"
      //   //   );

      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log(
      //   //   "3rd party price is ",
      //   //   userSessionData[sessionID].thirdPartyPrice
      //   // );
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial ambulance/hearse is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;

      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // } else if (userSessionData[sessionID].type === "artOrTanker") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;
      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     // userSessionData[sessionID].phoneNumberComp,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Art/Tanker " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Art/Tanker comp. comm"
      //   //   );
      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log(
      //   //   "3rd party price is ",
      //   //   userSessionData[sessionID].thirdPartyPrice
      //   // );
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial art/tankers is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;

      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // } else if (userSessionData[sessionID].type === "Taxi") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;
      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     // userSessionData[sessionID].phoneNumberComp,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Taxi " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Taxi car comp. comm"
      //   //   );

      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log(
      //   //   "3rd party price is ",
      //   //   userSessionData[sessionID].thirdPartyPrice
      //   // );
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial taxi is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;

      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // } else if (userSessionData[sessionID].type === "miniBus") {
      //   // const totalPrice =
      //   //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   // if (userSessionData[sessionID].carPrice < 50000) {
      //   //   message = "The car value cannot be less than 50000 GHS";
      //   // } else {
      //   //   let amount = totalPrice;
      //   //   // add 3% of the amount as processing fee
      //   //   let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //   //   await pay(
      //   //     tot_amt,
      //   //     // userSessionData[sessionID].phoneNumberComp,
      //   //     userSessionData[sessionID].phoneNumber,
      //   //     "Comprehensive Commercial Mini Bus " +
      //   //       userSessionData[sessionID].itemNumber,
      //   //     "Buy Mini Bus comp. comm"
      //   //   );

      //   //   // message = `Pay ${totalPrice}`;
      //   //   message = `${finalMessage} ` + tot_amt + ` now `;
      //   // }

      //   // console.log("Price is ", userSessionData[sessionID].thirdPartyPrice);
      //   // console.log("And car value is", userSessionData[sessionID].carPrice);

      //   // console.log(
      //   //   "Total amount to be paid for comprehensive commercial Mini Bus is",
      //   //   totalPrice
      //   // );
      //   // continueSession = false;

      //   message = numberToPayWithMessage;
      //   // userSessionData[sessionID].carPrice = userData;
      //   console.log(
      //     "Year of Manufacture",
      //     userSessionData[sessionID].YearOfManufacture
      //   );
      //   ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      //   continueSession = true;
      // }
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (userSessionData[sessionID].type === "maxiBus") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;

            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Max Bus " +
                userSessionData[sessionID].itemNumber,
              "Buy Max Bus comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial maxi bus is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "hiring") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Hiring Car " +
                userSessionData[sessionID].itemNumber,
              "Buy Hiring car comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial hiring cars is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "ambulance") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive Commercial Ambulance/Hearse " +
                userSessionData[sessionID].itemNumber,
              "Buy Ambul/Hearse comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial ambulance/hearse is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "artOrTanker") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive Commercial Art/Tanker " +
                userSessionData[sessionID].itemNumber,
              "Buy Art/Tanker comp. comm"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial art/tankers is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "Taxi") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive Commercial Taxi " +
                userSessionData[sessionID].itemNumber,
              "Buy Taxi car comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial taxi is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "miniBus") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive Commercial Mini Bus " +
                userSessionData[sessionID].itemNumber,
              "Buy Mini Bus comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log("Price is ", userSessionData[sessionID].thirdPartyPrice);
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial Mini Bus is",
            DisplayAmount
          );
          continueSession = false;
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "maxiBus") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Max Bus " +
                userSessionData[sessionID].itemNumber,
              "Renew Max Bus comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial maxi bus is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "hiring") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Hiring Car " +
                userSessionData[sessionID].itemNumber,
              "Renew Hiring car comp. comm"
            );

            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial hiring cars is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "ambulance") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Ambulance/Hearse " +
                userSessionData[sessionID].itemNumber,
              "Renew Ambul/Hearse comp. comm"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial ambulance/hearse is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "artOrTanker") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Art/Tanker " +
                userSessionData[sessionID].itemNumber,
              "Renew Art/Tanker comp. comm"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial art/tankers is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "Taxi") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              req.body.msisdn,
              "Comprehensive Commercial Taxi " +
                userSessionData[sessionID].itemNumber,
              "Renew Taxi car comp. comm"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log(
            "3rd party price is ",
            userSessionData[sessionID].thirdPartyPrice
          );
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial taxi is",
            DisplayAmount
          );
          continueSession = false;
        } else if (userSessionData[sessionID].type === "miniBus") {
          const totalPrice =
            parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
            parseInt(userSessionData[sessionID].thirdPartyPrice);
          if (userSessionData[sessionID].carPrice < 50000) {
            message = "The car value cannot be less than 50000 GHS";
          } else {
            let amount = totalPrice;
            // add 3% of the amount as processing fee
            let tot_amt = (processingFeePercentage / 100) * amount + amount;
            DisplayAmount = tot_amt;
            await pay(
              tot_amt,
              // userSessionData[sessionID].phoneNumberComp,
              req.body.msisdn,
              "Comprehensive Commercial Mini Bus " +
                userSessionData[sessionID].itemNumber,
              "Renew Mini Bus comp. comm"
            );
            // message = `Pay ${totalPrice}`;
            message = `${finalMessage} ` + tot_amt + ` now `;
          }

          console.log("Price is ", userSessionData[sessionID].thirdPartyPrice);
          console.log("And car value is", userSessionData[sessionID].carPrice);

          console.log(
            "Total amount to be paid for comprehensive commercial Mini Bus is",
            DisplayAmount
          );
          continueSession = false;
        }
      }
    } else if (userSessionData[sessionID].service === "6") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      //   if (userSessionData[sessionID].type === "privateX1") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Private Individual X1 " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy indv X1 comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private individual X1 is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "privateX4") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Private Individual X4 " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy indv X4 comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private individual X4 is",
      //       DisplayAmount
      //     );
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Own Goods(Below 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Own Goods(<3,000) comp. pvt"
      //       );
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private own goods below 3000 cc is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Own Goods(Above 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Own.G (>3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private Own Goods (ABOVE 3000 cc) is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (
      //     userSessionData[sessionID].type === "generalCartageBelow3000"
      //   ) {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt General Cartage(Below 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Gen.Crt (<3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private General Cartage (BELOW 3000 cc) is",
      //       totalPrice
      //     );
      //     continueSession = false;
      //   } else if (
      //     userSessionData[sessionID].type === "generalCartageAbove3000"
      //   ) {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt General Cartage(Above 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Gen.Crt (>3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private General Cartage (ABOVE 3,000 cc) is",
      //       totalPrice
      //     );
      //     continueSession = false;
      //   }
      // } else if (userSessionData[sessionID].InsuranceType === "renewal") {
      //   if (userSessionData[sessionID].type === "privateX1") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Private Individual X1 " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew indv X1 comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private individual X1 is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "privateX4") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Private Individual X4 " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew indv X4 comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private individual X4 is",
      //       DisplayAmount
      //     );
      //     continueSession = true;
      //   } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Own Goods(Below 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Own Goods(<3,000) comp. pvt"
      //       );
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private own goods below 3000 cc is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt Own Goods(Above 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Own.G (>3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private Own Goods (ABOVE 3000 cc) is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (
      //     userSessionData[sessionID].type === "generalCartageBelow3000"
      //   ) {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt General Cartage(Below 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Gen.Crt (<3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private General Cartage (BELOW 3000 cc) is",
      //       totalPrice
      //     );
      //     continueSession = false;
      //   } else if (
      //     userSessionData[sessionID].type === "generalCartageAbove3000"
      //   ) {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive-Prvt General Cartage(Above 3,000 cc) " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Gen.Crt (>3,000) comp. pvt"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive private General Cartage (ABOVE 3,000 cc) is",
      //       totalPrice
      //     );
      //     continueSession = false;
      //   }
      // }
    }

    if (userSessionData[sessionID].type === "specialOnSite") {
      // message = numberToPayWithMessage;
      message = whatsappMessage;
      // whatsappNum = userSessionData[sessionID].whatsappNumber;
      console.log(
        "Year of Manufacture",
        userSessionData[sessionID].YearOfManufacture
      );
      ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      continueSession = true;
    } else if (userSessionData[sessionID].type === "specialOnRoad") {
      // const totalPrice =
      //   parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
      //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      // if (userSessionData[sessionID].carPrice < 50000) {
      //   message = "The car value cannot be less than 50000 GHS";
      // } else {
      //   // message = `Pay ${totalPrice}`;
      //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
      //   let amount = totalPrice;
      //   await pay(
      //     amount,
      //     userSessionData[sessionID].phoneNumber,
      //     "Buy spc(ON ROAD) comp. comm"
      //   );
      // }
      // console.log(
      //   "3rd party price is ",
      //   userSessionData[sessionID].thirdPartyPrice
      // );
      // console.log("And car value is", userSessionData[sessionID].carPrice);

      // console.log(
      //   "Total amount to be paid for comprehensive commercial special type (ON ROAD) is",
      //   totalPrice
      // );
      // continueSession = false;
      message = whatsappMessage;
      // whatsappNum = userSessionData[sessionID].whatsappNumber;
      console.log(
        "Year of Manufacture",
        userSessionData[sessionID].YearOfManufacture
      );
      ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS1") {
      // const totalPrice =
      //   parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
      //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      // if (userSessionData[sessionID].carPrice < 50000) {
      //   message = "The car value cannot be less than 50000 GHS";
      // } else {
      //   // message = `Pay ${totalPrice}`;
      //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
      //   let amount = totalPrice;
      //   await pay(
      //     amount,
      //     userSessionData[sessionID].phoneNumber,
      //     "Buy GW1(CLASS 1) comp. comm"
      //   );
      // }

      // console.log(
      //   "3rd party price is ",
      //   userSessionData[sessionID].thirdPartyPrice
      // );
      // console.log("And car value is", userSessionData[sessionID].carPrice);

      // console.log(
      //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
      //   totalPrice
      // );
      // continueSession = false;

      message = whatsappMessage;
      // whatsappNum = userSessionData[sessionID].whatsappNumber;
      console.log(
        "Year of Manufacture",
        userSessionData[sessionID].YearOfManufacture
      );
      ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS2") {
      // const totalPrice =
      //   parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      // if (userSessionData[sessionID].carPrice < 50000) {
      //   message = "The car value cannot be less than 50000 GHS";
      // } else {
      //   // message = `Pay ${totalPrice}`;
      //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
      //   let amount = totalPrice;
      //   await pay(
      //     amount,
      //     userSessionData[sessionID].phoneNumber,
      //     "Buy GW1(CLASS 2) comp. comm"
      //   );
      // }

      // console.log(
      //   "3rd party price is ",
      //   userSessionData[sessionID].thirdPartyPrice
      // );
      // console.log("And car value is", userSessionData[sessionID].carPrice);

      // console.log(
      //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
      //   totalPrice
      // );
      // continueSession = false;

      message = whatsappMessage;
      // whatsappNum = userSessionData[sessionID].whatsappNumber;
      console.log(
        "Year of Manufacture",
        userSessionData[sessionID].YearOfManufacture
      );
      ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS3") {
      // const totalPrice =
      //   parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //   parseInt(userSessionData[sessionID].thirdPartyPrice);
      // if (userSessionData[sessionID].carPrice < 50000) {
      //   message = "The car value cannot be less than 50000 GHS";
      // } else {
      //   // message = `Pay ${totalPrice}`;
      //   message = `${finalMessage} ` + `${totalPrice}` + ` now `;
      //   let amount = totalPrice;
      //   await pay(
      //     amount,
      //     userSessionData[sessionID].phoneNumber,
      //     "Buy GW1(CLASS 3) comp. comm"
      //   );
      // }

      // console.log(
      //   "3rd party price is ",
      //   userSessionData[sessionID].thirdPartyPrice
      // );
      // console.log("And car value is", userSessionData[sessionID].carPrice);

      // console.log(
      //   "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
      //   totalPrice
      // );
      // continueSession = false;

      message = whatsappMessage;
      // whatsappNum = userSessionData[sessionID].whatsappNumber;
      console.log(
        "Year of Manufacture",
        userSessionData[sessionID].YearOfManufacture
      );
      ManufacturedYear = userSessionData[sessionID].YearOfManufacture;
      continueSession = true;
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 9) {
    userSessionData[sessionID].phoneNumber = userData;
    userSessionData[sessionID].whatsappNumber = userData;
    if (userSessionData[sessionID].InsuranceType === "purchase") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 1.5) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial Special Types(ON SITE) " +
              userSessionData[sessionID].itemNumber,
            "Buy spc(ON SITE) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 3) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial Special Types(ON ROAD) " +
              userSessionData[sessionID].itemNumber,
            "Buy spc(ON ROAD) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }
        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial special type (ON ROAD) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 5) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 1) " +
              userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 1) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 6) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 2) " +
              userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 2) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 3) " +
              userSessionData[sessionID].itemNumber,
            "Buy GW1(CLASS 3) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
          DisplayAmount
        );
        continueSession = false;
      }
    } else if (userSessionData[sessionID].InsuranceType === "renewal") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 1.5) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial Special Types(ON SITE) " +
              userSessionData[sessionID].itemNumber,
            "Renew spc(ON SITE) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 3) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial Special Types(ON ROAD) " +
              userSessionData[sessionID].itemNumber,
            "Renew spc(ON ROAD) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }
        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial special type (ON ROAD) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 5) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 1) " +
              userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 1) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 6) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 2) " +
              userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 2) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
          DisplayAmount
        );
        continueSession = false;
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPriceCompComm * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPriceCompComm < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          let amount = totalPrice;
          // add 3% of the amount as processing fee
          let tot_amt = (processingFeePercentage / 100) * amount + amount;
          DisplayAmount = tot_amt;
          await pay(
            tot_amt,
            req.body.msisdn,
            "Comprehensive Commercial GW1(CLASS 3) " +
              userSessionData[sessionID].itemNumber,
            "Renew GW1(CLASS 3) comp. comm"
          );
          // message = `Pay ${totalPrice}`;
          message = `${finalMessage} ` + tot_amt + ` now `;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log(
          "And car value is",
          userSessionData[sessionID].carPriceCompComm
        );

        console.log(
          "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
          DisplayAmount
        );
        continueSession = false;
      }
    }

    if (userSessionData[sessionID].service === "5") {
      // if (userSessionData[sessionID].InsuranceType === "purchase") {
      //   if (userSessionData[sessionID].type === "maxiBus") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;

      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Max Bus " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Max Bus comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial maxi bus is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "hiring") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Hiring Car " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Hiring car comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial hiring cars is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "ambulance") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Ambulance/Hearse " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Ambul/Hearse comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial ambulance/hearse is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "artOrTanker") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Art/Tanker " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Art/Tanker comp. comm"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial art/tankers is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "Taxi") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Taxi " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Taxi car comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial taxi is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "miniBus") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Mini Bus " +
      //           userSessionData[sessionID].itemNumber,
      //         "Buy Mini Bus comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log("Price is ", userSessionData[sessionID].thirdPartyPrice);
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial Mini Bus is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   }
      // } else if (userSessionData[sessionID].InsuranceType === "renewal") {
      //   if (userSessionData[sessionID].type === "maxiBus") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Max Bus " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Max Bus comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial maxi bus is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "hiring") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Hiring Car " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Hiring car comp. comm"
      //       );

      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial hiring cars is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "ambulance") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Ambulance/Hearse " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Ambul/Hearse comp. comm"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial ambulance/hearse is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "artOrTanker") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Art/Tanker " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Art/Tanker comp. comm"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial art/tankers is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "Taxi") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Taxi " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Taxi car comp. comm"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log(
      //       "3rd party price is ",
      //       userSessionData[sessionID].thirdPartyPrice
      //     );
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial taxi is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   } else if (userSessionData[sessionID].type === "miniBus") {
      //     const totalPrice =
      //       parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //       parseInt(userSessionData[sessionID].thirdPartyPrice);
      //     if (userSessionData[sessionID].carPrice < 50000) {
      //       message = "The car value cannot be less than 50000 GHS";
      //     } else {
      //       let amount = totalPrice;
      //       // add 3% of the amount as processing fee
      //       let tot_amt = (processingFeePercentage / 100) * amount + amount;
      //       DisplayAmount = tot_amt;
      //       await pay(
      //         tot_amt,
      //         // userSessionData[sessionID].phoneNumberComp,
      //         userSessionData[sessionID].phoneNumber,
      //         "Comprehensive Commercial Mini Bus " +
      //           userSessionData[sessionID].itemNumber,
      //         "Renew Mini Bus comp. comm"
      //       );
      //       // message = `Pay ${totalPrice}`;
      //       message = `${finalMessage} ` + tot_amt + ` now `;
      //     }

      //     console.log("Price is ", userSessionData[sessionID].thirdPartyPrice);
      //     console.log("And car value is", userSessionData[sessionID].carPrice);

      //     console.log(
      //       "Total amount to be paid for comprehensive commercial Mini Bus is",
      //       DisplayAmount
      //     );
      //     continueSession = false;
      //   }
      // }
    }

    // // Increment the step for the next interaction
    // userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else {
    message = "Please dial *928*311#";
    continueSession = false;
  }

  let response = {
    sessionID: sessionID,
    msisdn: msisdn,
    message: message,
    continueSession: continueSession,
    userID: userID,
    network: network,
  };

  res.send(response);
});

// // Nalo solutions callback URL
// router.post("/callback", async (req, res) => {
//   console.log("callback success", req.body);
//   res.status(200).json({ message: "callback success" });
// });

// router.post("/callback", async (req, res) => {
//   console.log("callback success", req.body);
//   res.status(200).json({ message: "callback success" });
//   console.log("Invoive Number", InvoiceNo);
//   console.log("Order ID", OrderId);
//   console.log("Send SMS TO", NumToSendSMS);
//   if (
//     req.body.InvoiceNo == InvoiceNo &&
//     req.body.Order_id == OrderId &&
//     req.body.Status === "PAID"
//   ) {
//     try {
//       const paymentResponse = await PaymentResponse.create({
//         itemName: ItemName,
//         amount: AmountSaveToDB,
//         carnums: carNum,
//         phoneNumber: NumberToSave,
//         whatsappnums: whatsappNum,
//         // Adding status field with a specific value
//         status: "pending", // Or you can omit this line to use the default value
//       });
//       // Proceed with further logic if creation is successful
//       console.log("Payment response created:", paymentResponse);
//     } catch (error) {
//       // Handle errors here
//       console.error("Error creating payment response:", error);
//     }

//     // send confirmation message
//     // Compose SMS message
//     const SUCCESS_SMS_MESSAGE = `Thank you for choosing AEGIS RISK MANAGEMENT BROKERS. Your purchase is confirmed. Visit option 4, to send the required documents to WhatsApp number +233591539372 or call us.`;

//     // // Compose URL for sending SMS
//     // const SEND_SMS_URL = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}&to=${NumToSendSMS}&from=Flexible&sms=${SMS_MESSAGE}`;

//     // Send SMS
//     const smsResponse = await axios.get(
//       `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}=&to=${NumToSendSMS}&from=Flexible&sms=${SUCCESS_SMS_MESSAGE}`
//     );

//     console.log("SMS Sent:", smsResponse.data.message);
//   } else if (req.body.Status === "FAILED") {
//     // Compose SMS message
//     const FAILED_SMS_MESSAGE = `Hi, we noticed that your transaction failed. Please ensure that you have enough balance and get back or call us.`;

//     // Compose URL for sending SMS
//     // const SEND_SMS_URL = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=OjRCamtoVTFnSFp6b2oxOGk&to=${NumToSendSMS}&from=Flexible&sms=${SMS_MESSAGE}`;

//     // Send SMS
//     const smsResponse = await axios.get(
//       `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}=&to=${NumToSendSMS}&from=Flexible&sms=${FAILED_SMS_MESSAGE}`
//     );

//     console.log("SMS Sent:", smsResponse.data.message);
//   }
// });

router.post("/callback", async (req, res) => {
  console.log("callback success", req.body);
  res.status(200).json({ message: "callback success" });
  // console.log("Invoice Number", InvoiceNo);
  // console.log("Order ID", OrderId);
  // console.log("Send SMS TO", NumToSendSMS);
  if (
    req.body.Message == "success"
  ) {
    try {
      const paymentResponse = await PaymentResponse.create({
        itemName: ItemName,
        amount: AmountSaveToDB,
        carnums: carNum,
        phoneNumber: NumberToSave,
        whatsappnums: whatsappNum,
        // Adding status field with a specific value
        status: "pending", // Or you can omit this line to use the default value
      });
      // Proceed with further logic if creation is successful
      console.log("Payment response created:", paymentResponse);
    } catch (error) {
      // Handle errors here
      console.error("Error creating payment response:", error);
    }

    // send confirmation message
    // Compose SMS message
    // const SUCCESS_SMS_MESSAGE =
    //   "Thank you for choosing AEGIS RISK MANAGEMENT BROKERS. Your purchase is confirmed. Visit option 4, to send the required documents to WhatsApp number +233591539372.";

    // // Send SMS
    // const smsResponse = await axios.get(
    //   `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}=&to=${NumToSendSMS}&from=Flexible&sms=${SUCCESS_SMS_MESSAGE}`
    // );

    // console.log("SMS Sent:", smsResponse.data.message);
  } else if (req.body.Message === "Failed") {
    // // Compose SMS message
    // const FAILED_SMS_MESSAGE =
    //   "Hi, we noticed that your transaction failed. Please ensure that you have enough balance and get back. WhatsApp or call us on +233591539372.";

    // // Send SMS
    // const smsResponse = await axios.get(
    //   `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARKESEL_API_KEY}=&to=${NumToSendSMS}&from=Flexible&sms=${FAILED_SMS_MESSAGE}`
    // );

    console.log("SMS Sent:", req.body);
  }
});

// Nalo solutions redirect  URL
router.get("/redirect", (req, res) => {
  console.log("redirect success");

  res.status(200).json({ message: "redirect success" });
});

router.get("/dashboardData", async (req, res) => {
  try {
    // Fetch all records from the PaymentResponse model in descending order
    const dashboardData = await PaymentResponse.findAll({
      order: [["createdAt", "DESC"]], // Order by createdAt field in descending order
    });

    // Fetch total count of records
    const totalCount = await PaymentResponse.count();

    res.status(200).json({
      data: dashboardData,
      recordsTotal: totalCount, // Include total count in the response
    });
  } catch (error) {
    console.error("Error occurred while fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update the status field in the model
router.put("/updateStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the record in the PaymentResponse model based on the provided id
    const paymentResponse = await PaymentResponse.findByPk(id);

    // Check if the record exists
    if (!paymentResponse) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Update the status field
    paymentResponse.status = status;

    // Save the updated record
    await paymentResponse.save();

    res
      .status(200)
      .json({ message: "Status updated successfully", data: paymentResponse });
  } catch (error) {
    console.error("Error occurred while updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// router.get('/check-transaction-status', async (req, res) => {
//     // let ClientReferenceNum = '67c78750-9fec-4e06-8b98-18efd5579d45';

//     if (!ClientReferenceNumber) {
//         return res.status(400).json({ error: 'ClientReferenceNumber must be provided' });
//     }

//     try {
//         const checkStatusUrl = `https://api-txnstatus.hubtel.com/transactions/${process.env.HUBTEL_POS_SALES_ID}/status`;
//         const params = { clientReference: ClientReferenceNumber };

//         const response = await axios.get(checkStatusUrl, {
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Basic ${process.env.AUTHORIZATION_KEY}`
//           },
//           params: params // Ensure the params are included in the configuration object
//         });

//         if (response.status === 200) {
//             res.json(response.data);
//         } else {
//             res.status(response.status).json({ error: response.statusText });
//         }
//     } catch (error) {
//         console.error('Error checking transaction status:', error);
//         if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             res.status(error.response.status).json({ 
//                 error: 'Error from API', 
//                 details: error.response.data 
//             });
//         } else if (error.request) {
//             // The request was made but no response was received
//             res.status(500).json({ 
//                 error: 'No response received from API', 
//                 details: error.message 
//             });
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             res.status(500).json({ 
//                 error: 'Error in setting up request', 
//                 details: error.message 
//             });
//         }
//     }
// });


// Route to check transaction status
router.get('/status', async (req, res) => {
    const ClientReferenceNumber = req.query.clientReference;

    if (!ClientReferenceNumber) {
        return res.status(400).json({ error: 'ClientReferenceNumber must be provided' });
    }

    try {
        const checkStatusUrl = `https://api-txnstatus.hubtel.com/transactions/${process.env.HUBTEL_POS_SALES_ID}/status`;
        const params = { clientReference: ClientReferenceNumber };

        const response = await axios.get(checkStatusUrl, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${process.env.AUTHORIZATION_KEY}`
          },
          params: params
        });

        if (response.status === 200) {
            res.render('transaction-status', { data: response.data.data });
        } else {
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        console.error('Error checking transaction status:', error);
        if (error.response) {
            res.status(error.response.status).json({ 
                error: 'Error from API', 
                details: error.response.data 
            });
        } else if (error.request) {
            res.status(500).json({ 
                error: 'No response received from API', 
                details: error.message 
            });
        } else {
            res.status(500).json({ 
                error: 'Error in setting up request', 
                details: error.message 
            });
        }
    }
});


module.exports = router;
