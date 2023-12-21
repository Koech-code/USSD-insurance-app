const express = require("express");
const router = express.Router();

const USSDCODE = "*928*311#";
const userSessionData = {};

router.post("/ussd", (req, res) => {
  const { sessionID, newSession, msisdn, userData, userID, network } = req.body;
  let message = "";
  let service = "";
  let continueSession = "";
  let selectedOption = "";

  if (newSession && userData === USSDCODE) {
    // Initial session setup
    userSessionData[sessionID] = {
      step: 1,
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
      message = "Select the package that you want to purchase\n";
      message += "1. Third party commercial\n";
      message += "2. Third party private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comprehensive Co-oprate\n";
      message += "5. Comprehensive commercial\n";
      message += "6. Comprehensive private\n";
      continueSession = true;
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "2") {
      // Car type selection for Third Party
      service = "2";
      message = "Select the package that you want to renew\n";
      message += "1. Third party commercial\n";
      message += "2. Third party party private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comprehensive Co-oprate\n";
      message += "5. Comprehensive commercial\n";
      message += "6. Comprehensive private\n";
      continueSession = true;
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
      message = "1.Max Bus\n";
      message += "2. Hiring cars\n";
      message += "3. Ambulance/Hearse\n";
      message += "4. Special types (Z 802 ON SITE)";
      message += "5. Special types (Z 802 ON BOARD)";
      message += "6. GW1 Class 1\n";
      message += "7. GW1 Class 2\n";
      message += "8. GW1 Class 3\n";
      message += "9. Art/Tankers\n";
      message += "10. Taxi";

      continueSession = true;
    } else if (userSessionData[sessionID].service === "2") {
      // Car type selection for Third Party private
      service = "2";
      message = "1.Private individual (X1)\n";
      message += "2. Private company (X4)\n";
      message += "3. Own goods(Below 3000 cc)\n";
      message += "4. Own goods(Above 3000 cc)";
      message += "5. General Cartage(Up to 3000 cc)\n";
      message += "6. General cartage(Above 3000 cc)\n";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "3") {
      // Car type selection for motor cycle
      service = "3";
      message = "1. Mini bus\n";
      continueSession = true;
    }
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 3) {
    userSessionData[sessionID].selectedOption = userData;

    if (userSessionData[sessionID].service === "1") {
      // Additional logic for Third Party commercial - step 3
      if (userSessionData[sessionID].selectedOption === "1") {
        // Logic for Special Types
        service = "1";
        message =
          "You selected Max bus (23 - 70 persons). Enter number of persons your car can hold (e.g 23):\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "1";
        message =
          "You selected Hiring cars (5 - 15 persons). Enter number of persons your car can hold (e.g 5):\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Options for ambulance/hearse cars
        service = "1";
        message = "You selected Ambulance/Hearse. Choose an option:\n";
        message += "1. 5 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        // Logic for Special Types (Z 802 ON SITE)
        service = "1";
        message =
          "You selected Special Types(Z 802 ON SITE). Choose an option:\n";
        message += "1. 1 - 5 persons\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Logic for Special Types (Z 802 ON BOARD)
        service = "5";
        message =
          "You selected Special Types(Z 802 ON BOARD). Choose an option:\n";
        message += "1. 1 - 5 persons\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "6") {
        // Logic for Special Types
        service = "1";
        message = "You selected GW1 Class 1. Choose a class it falls into:\n";
        message += "1. 1 - 5 persons\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "7") {
        // Logic for Special Types
        service = "1";
        message = "You selected GW1 Class 2. Choose a class it falls into:\n";
        message += "1. 1 - 5 persons\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "8") {
        // Logic for Special Types
        service = "1";
        message = "You selected GW1 Class 3. Choose a class it falls into:\n";
        message += "1. 1 - 5 persons\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "9") {
        // Logic for Special Types
        service = "1";
        message = "You selected art/tankers. Choose an option:\n";
        message += "3 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "10") {
        // Logic for Special Types
        service = "1";
        message = "You selected taxi. Choose an option:\n";
        message += "1. 5 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      }
    } else if (userSessionData[sessionID].service === "2") {
      if (userSessionData[sessionID].selectedOption === "1") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected private individual (X1).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected private company (X4).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected own goods (BELOW 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected own goods (ABOVE 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected general cartage (UP TO 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "6") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected general cartage (BELOW 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        continueSession = true; // Set to true to continue the session
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 4) {
    userSessionData[sessionID].selectedOption = userData;

    if (userSessionData[sessionID].service === "1") {
      // Check if the service is Third Party Commercial
      const maxBusServicePrices = {
        23: { price: 849.0, type: "maxBus" },
        24: { price: 861.0, type: "maxBus" },
        25: { price: 873.0, type: "maxBus" },
        26: { price: 885.0, type: "maxBus" },
        27: { price: 897.0, type: "maxBus" },
        28: { price: 909.0, type: "maxBus" },
        29: { price: 921.0, type: "maxBus" },
        30: { price: 933.0, type: "maxBus" },
        31: { price: 945.0, type: "maxBus" },
        32: { price: 957.0, type: "maxBus" },
        33: { price: 969.0, type: "maxBus" },
        34: { price: 981.0, type: "maxBus" },
        35: { price: 993.0, type: "maxBus" },
        36: { price: 1005.0, type: "maxBus" },
        37: { price: 1017.0, type: "maxBus" },
        38: { price: 1029.0, type: "maxBus" },
        39: { price: 1041.0, type: "maxBus" },
        40: { price: 1053.0, type: "maxBus" },
        41: { price: 1065.0, type: "maxBus" },
        42: { price: 1077.0, type: "maxBus" },
        43: { price: 1089.0, type: "maxBus" },
        44: { price: 1101.0, type: "maxBus" },
        45: { price: 1113.0, type: "maxBus" },
        46: { price: 1125.0, type: "maxBus" },
        47: { price: 1137.0, type: "maxBus" },
        48: { price: 1149.0, type: "maxBus" },
        49: { price: 1161.0, type: "maxBus" },
        50: { price: 1173.0, type: "maxBus" },
        51: { price: 1185.0, type: "maxBus" },
        52: { price: 1197.0, type: "maxBus" },
        53: { price: 1209.0, type: "maxBus" },
        54: { price: 1221.0, type: "maxBus" },
        55: { price: 1233.0, type: "maxBus" },
        56: { price: 1245.0, type: "maxBus" },
        57: { price: 1257.0, type: "maxBus" },
        58: { price: 1269.0, type: "maxBus" },
        59: { price: 1281.0, type: "maxBus" },
        60: { price: 1293.0, type: "maxBus" },
        61: { price: 1305.0, type: "maxBus" },
        62: { price: 1317.0, type: "maxBus" },
        63: { price: 1329.0, type: "maxBus" },
        64: { price: 1341.0, type: "maxBus" },
        65: { price: 1353.0, type: "maxBus" },
        66: { price: 1365.0, type: "maxBus" },
        67: { price: 1377.0, type: "maxBus" },
        68: { price: 1389.0, type: "maxBus" },
        69: { price: 1401.0, type: "maxBus" },
        70: { price: 1413.0, type: "maxBus" },
      };
      const hiringCarsServicePrices = {
        5: { price: 633.0, type: "hiringCars" },
        6: { price: 645.0, type: "hiringCars" },
        7: { price: 657.0, type: "hiringCars" },
        8: { price: 669.0, type: "hiringCars" },
        9: { price: 681.0, type: "hiringCars" },
        10: { price: 693.0, type: "hiringCars" },
        11: { price: 705.0, type: "hiringCars" },
        12: { price: 717.0, type: "hiringCars" },
        13: { price: 729.0, type: "hiringCars" },
        14: { price: 741.0, type: "hiringCars" },
        15: { price: 753.0, type: "hiringCars" },
      };
      const ambulanceOrHearseServicePrices = {
        5: { price: 503.0, type: "ambulanceOrHearse" },
      };

      const onSiteSpecialTypesServicePrice = {
        1: { price: 353.0, type: "onSiteSpecialTypes" },
        2: { price: 353.0, type: "onSiteSpecialTypes" },
        3: { price: 353.0, type: "onSiteSpecialTypes" },
        4: { price: 353.0, type: "onSiteSpecialTypes" },
        5: { price: 353.0, type: "onSiteSpecialTypes" },
      };

      const onBoardSpecialTypesServicePrice = {
        1: { price: 623.0, type: "onBoardSpecialTypes" },
        2: { price: 623.0, type: "onBoardSpecialTypes" },
        3: { price: 623.0, type: "onBoardSpecialTypes" },
        4: { price: 623.0, type: "onBoardSpecialTypes" },
        5: { price: 623.0, type: "onBoardSpecialTypes" },
      };

      const GW1Class1ServicePrice = {
        1: { price: 508.0, type: "GW1Class1" },
        2: { price: 508.0, type: "GW1Class1" },
        3: { price: 508.0, type: "GW1Class1" },
        4: { price: 508.0, type: "GW1Class1" },
        5: { price: 508.0, type: "GW1Class1" },
      };

      const GW1Class2ServicePrice = {
        1: { price: 633.0, type: "GW1Class2" },
        2: { price: 633.0, type: "GW1Class2" },
        3: { price: 633.0, type: "GW1Class2" },
        4: { price: 633.0, type: "GW1Class2" },
        5: { price: 633.0, type: "GW1Class2" },
      };

      const GW1Class3ServicePrice = {
        1: { price: 788.0, type: "GW1Class3" },
        2: { price: 788.0, type: "GW1Class3" },
        3: { price: 788.0, type: "GW1Class3" },
        4: { price: 788.0, type: "GW1Class3" },
        5: { price: 788.0, type: "GW1Class3" },
      };

      const artOrTankersServicePrices = {
        3: { price: 903.0, type: "artOrTankers" },
      };

      const taxiServicePrices = {
        5: { price: 618.0, type: "taxi" },
      };

      let price, type;

      // Check the type of car and retrieve the corresponding price
      if (userSessionData[sessionID].selectedOption === "1") {
        // Logic for Max Bus
        price = maxBusServicePrices[selectedOption]?.price;
        type = maxBusServicePrices[selectedOption]?.type;
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Logic for Hiring Cars
        price = hiringCarsServicePrices[selectedOption]?.price;
        type = hiringCarsServicePrices[selectedOption]?.type;
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Logic for ambulance/hearse
        price = ambulanceOrHearseServicePrices[selectedOption]?.price;
        type = ambulanceOrHearseServicePrices[selectedOption]?.type;
      }
      // Add more cases for other car types...

      if (price && type) {
        service = "1";
        message = `You selected ${type}. Price: ${price.toFixed(2)}`;
        continueSession = true;
      } else {
        message = "Invalid option selected for Third Party Commercial.";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].service === "2") {
      // Check if the service is Third Party Private
      const privateIndividualPrices = {
        1: 500.0, // You can define your own pricing logic here
        2: 600.0,
        // Add more options as needed
      };

      // Check if the selected option exists in the mapping
      if (
        privateIndividualPrices.hasOwnProperty(
          userSessionData[sessionID].selectedOption
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message =
          "Pay " +
          privateIndividualPrices[
            userSessionData[sessionID].selectedOption
          ].toFixed(2);
        continueSession = true;
      } else {
        message = "Invalid option selected for Third Party Private.";
        continueSession = false;
      }
    } else {
      message =
        "Step 4 is only applicable to Third Party Commercial and Third Party Private services.";
      continueSession = false;
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
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

// Seerbit call back URL
router.get("/callback", (req, res) => {
  console.log("callback success");
  res.status(200).json({ message: "callback success" });
});

// Seerbit redirect  URL
router.get("/redirect", (req, res) => {
  console.log("redirect success");

  res.status(200).json({ message: "redirect success" });
});
module.exports = router;
