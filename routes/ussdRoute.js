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
    userSessionData[sessionID].service = userData;
    if (userSessionData[sessionID].service === "1") {
      // Logic for Special Types
      service = "1";
      message =
        "You selected Max bus (23 - 70 persons). Enter number of persons your car can hold (e.g 23):\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "2") {
      // Logic for Special Types
      service = "2";
      message =
        "You selected Hiring cars (5 - 15 persons). Enter number of persons your car can hold (e.g 5):\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "3") {
      // Options for ambulance/hearse cars
      service = "3";
      message = "You selected Ambulance/Hearse. Choose an option:\n";
      message += "1. 5 persons \n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "4") {
      // Logic for Special Types (Z 802 ON SITE)
      service = "4";
      message =
        "You selected Special Types(Z 802 ON SITE). Choose an option:\n";
      message += "1. 1 - 5 persons\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "5") {
      // Logic for Special Types (Z 802 ON BOARD)
      service = "5";
      message =
        "You selected Special Types(Z 802 ON BOARD). Choose an option:\n";
      message += "1. 1 - 5 persons\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "6") {
      // Logic for Special Types
      service = "6";
      message = "You selected GW1 Class 1. Choose a class it falls into:\n";
      message += "1. 1 - 5 persons\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "7") {
      // Logic for Special Types
      service = "7";
      message = "You selected GW1 Class 2. Choose a class it falls into:\n";
      message += "1. 1 - 5 persons\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "8") {
      // Logic for Special Types
      service = "8";
      message = "You selected GW1 Class 3. Choose a class it falls into:\n";
      message += "1. 1 - 5 persons\n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "9") {
      // Options for art/tankers
      service = "9";
      message = "You selected art/tankers. Choose an option:\n";
      message += "3 persons \n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    } else if (userSessionData[sessionID].service === "10") {
      // Options for ambulance/hearse cars
      service = "10";
      message = "You selected taxi. Choose an option:\n";
      message += "1. 5 persons \n";
      // Save the user's input as the selected option
      userSessionData[sessionID].selectedOption = userData;
      console.log("user selected", userData);
      continueSession = true; // Set to true to continue the session
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 4) {
    userSessionData[sessionID].service = userData;
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
      5: 503.0,
    };

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

    const artOrTankersServicePrices = {
      3: 903.0,
    };

    const taxiServicePrices = {
      5: 618.0,
    };
    if (userSessionData[sessionID].selectedOption === "1") {
      // Check if the user input exists in the mapping
      if (
        maxBusServicePrices.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + maxBusServicePrices[service].toFixed(2);
        continueSession = true;
      } else if (
        !maxBusServicePrices.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        message =
          "The number you entered is out of range. A Max bus can carry 23 - 70 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "2") {
      // Check if the user input exists in the mapping
      if (
        hiringCarsServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + hiringCarsServicePrices[service].toFixed(2);
        continueSession = true;
      } else if (
        !hiringCarsServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. A hiring car holds 5 - 15 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "3") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        ambulanceOrHearseServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + ambulanceOrHearseServicePrices[service].toFixed(2);
        continueSession = true;
      } else if (
        !ambulanceOrHearseServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. An ambulance/hearse holds only 5 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "4") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        onSiteSpecialTypesServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + onSiteSpecialTypesServicePrice[service].toFixed(2);
        continueSession = true;
      } else if (
        !onSiteSpecialTypesServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. Special types(ON SITE) holds only 1 - 5 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "5") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        onBoardSpecialTypesServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + onBoardSpecialTypesServicePrice[service].toFixed(2);
        continueSession = true;
      } else if (
        !onBoardSpecialTypesServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. Special types(ON BOARD) holds only 1 - 5 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "6") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        GW1Class1ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + GW1Class1ServicePrice[service].toFixed(2);
        continueSession = true;
      } else if (
        !GW1Class1ServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. GW1(Class 1) holds only 1 - 5 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "7") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        GW1Class2ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + GW1Class2ServicePrice[service].toFixed(2);
        continueSession = true;
      } else if (
        !GW1Class2ServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. GW1(Class 2) holds only 1 - 5 persons)";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "8") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        GW1Class3ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + GW1Class3ServicePrice[service].toFixed(2);
        continueSession = true;
      } else if (
        !GW1Class3ServicePrice.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. GW1 (Class 3) holds only 1 - 5 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "9") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        artOrTankersServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + artOrTankersServicePrices[service].toFixed(2);
        continueSession = true;
      } else if (
        !artOrTankersServicePrices.hasOwnProperty(
          userSessionData[sessionID].service
        )
      ) {
        message =
          "The number you entered is out of range. An art/tanker holds only 3 persons";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].selectedOption === "10") {
      // Check if the user input exists in the ambulance/hearse mapping
      if (
        taxiServicePrices.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        service = userSessionData[sessionID].service;
        // Get the price dynamically from the mapping
        message = "Pay " + taxiServicePrices[service].toFixed(2);
        continueSession = true;
      } else if (
        !taxiServicePrices.hasOwnProperty(userSessionData[sessionID].service)
      ) {
        message =
          "The number you entered is out of range. A taxi holds only 5 persons";
        continueSession = false;
      }
    }
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
