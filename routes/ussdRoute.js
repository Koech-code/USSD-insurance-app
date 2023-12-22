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
  let type = "";
  let carPrice = "";
  let thirdPartyPrice = "";
  let GW1Options = "";
  let InsuranceType = "";
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
      message = "Select a package to purchase\n";
      message += "1. 3rd party Comm.\n";
      message += "2. 3rd party Private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comp. Co-oporate\n";
      message += "5. Comp. Commercial\n";
      message += "6. Comp. Private";
      continueSession = true;
      userSessionData[sessionID].InsuranceType = "purchase";
      userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
    } else if (userSessionData[sessionID].service === "2") {
      // Car type selection for Third Party
      service = "2";
      message = "Select a package to renew\n";
      message += "1. 3rd party Comm.\n";
      message += "2. 3rd party Private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comp. Co-oprate\n";
      message += "5. Comp. Commercial\n";
      message += "6. Comp. Private";
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
      message += "4. Special types\n";
      message += "5. GW1\n";
      message += "6. Art/Tankers\n";
      message += "7. Taxi\n";
      message += "8. Mini Bus";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "2") {
      // Car type selection for Third Party private
      service = "2";
      message = "1.Private individual (X1)\n";
      message += "2. Private company (X4)\n";
      message += "3. Own goods(Below 3000 cc)\n";
      message += "4. Own goods(Above 3000 cc)\n";
      message += "5. General Cartage(Up to 3000 cc)\n";
      message += "6. General cartage(Above 3000 cc)\n";
      message += "7. Mini Bus";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "3") {
      // Car type selection for motor cycle
      service = "3";
      message = "1. Mini bus\n";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "4") {
      // Car type selection for motor cycle
      service = "4";
      message = "1. Motor Cycle\n";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "5") {
      // Car type selection for comprehensive commercial
      service = "5";
      message = "Please select your car type\n";
      message += "1.Max Bus\n";
      message += "2. Hiring cars\n";
      message += "3. Ambulance/Hearse\n";
      message += "4. Special types\n";
      message += "5. GW1\n";
      message += "6. Art/Tankers\n";
      message += "7. Taxi\n";
      message += "8. Mini Bus";
      continueSession = true;
    } else if (userSessionData[sessionID].service === "6") {
      // Car type selection for comprehensive private
      service = "6";
      message = "Please select your car type\n";
      message += "1.Private individual (X1)\n";
      message += "2. Private company (X4)\n";
      message += "3. Own goods(Below 3000 cc)\n";
      message += "4. Own goods(Above 3000 cc)";
      message += "5. General Cartage(Up to 3000 cc)\n";
      message += "6. General cartage(Above 3000 cc)\n";
      // userSessionData[sessionID].carPrice = userData;
      // console.log("Price entered is", userSessionData[sessionID].carPrice);
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
        userSessionData[sessionID].type = "maxBus";
        console.log("user selected", userData);
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "1";
        message =
          "You selected Hiring cars (5 - 15 persons). Enter number of persons your car can hold (e.g 5):\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "hiringCars";
        console.log("user selected", userData);
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Options for ambulance/hearse cars
        service = "1";
        message = "You selected Ambulance/Hearse. Choose an option:\n";
        message += "1. 5 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        userSessionData[sessionID].type = "ambulanceOrHearse";
        console.log("user selected", userData);
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        // Logic for Special Types (Z 802 ON SITE)
        // service = "1";
        // message =
        //   "You selected Special Types(Z 802 ON SITE). Choose an option:\n";
        // message += "1. 1 - 5 persons\n";
        // // Save the user's input as the selected option
        // userSessionData[sessionID].selectedOption = userData;
        // console.log("user selected", userData);
        // userSessionData[sessionID].type = "specialOnSite";
        // console.log("user selected car type", userSessionData[sessionID].type);
        // continueSession = true; // Set to true to continue the session
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
      }
      // else if (userSessionData[sessionID].selectedOption === "7") {
      //   // Logic for Special Types
      //   service = "1";
      //   message = "You selected GW1 Class 2. Choose a class it falls into:\n";
      //   message += "1. 1 - 5 persons\n";
      //   // Save the user's input as the selected option
      //   userSessionData[sessionID].selectedOption = userData;
      //   console.log("user selected", userData);
      //   userSessionData[sessionID].type = "GW1Class2";
      //   console.log("user selected car type", userSessionData[sessionID].type);
      //   continueSession = true; // Set to true to continue the session
      // }
      // else if (userSessionData[sessionID].selectedOption === "8") {
      //   // Logic for Special Types
      //   service = "1";
      //   message = "You selected GW1 Class 3. Choose a class it falls into:\n";
      //   message += "1. 1 - 5 persons\n";
      //   // Save the user's input as the selected option
      //   userSessionData[sessionID].selectedOption = userData;
      //   console.log("user selected", userData);
      //   userSessionData[sessionID].type = "GW1Class3";
      //   console.log("user selected car type", userSessionData[sessionID].type);
      //   continueSession = true; // Set to true to continue the session
      // }
      else if (userSessionData[sessionID].selectedOption === "6") {
        // Logic for Special Types
        service = "1";
        message = "You selected art/tankers. Choose an option:\n";
        message += "3 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "artOrTankers";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "7") {
        // Logic for Special Types
        service = "1";
        message = "You selected taxi. Choose an option:\n";
        message += "1. 5 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "taxi";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "8") {
        // Logic for Special Types
        service = "1";
        message = "You selected Mini Bus. Choose an option:\n";
        message += "1. 5 - 22 persons \n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "miniBus";
        console.log("user selected car type", userSessionData[sessionID].type);
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
        userSessionData[sessionID].type = "privateIndividualX1";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "2") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected private company (X4).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "privateIndividualX4";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "3") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected own goods (BELOW 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "ownGoodsBelow";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "4") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected own goods (ABOVE 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "ownGoodsAbove";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "5") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected general cartage (UP TO 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);
        userSessionData[sessionID].type = "generalCartageBelow";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "6") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected general cartage (BELOW 3000 cc).\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);

        userSessionData[sessionID].type = "generalCartageAbove";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
      } else if (userSessionData[sessionID].selectedOption === "7") {
        // Handle choice 2 for Third Party commercial - step 3
        // Logic for Special Types
        service = "2";
        message = "You selected Mini Bus.\n";
        // Save the user's input as the selected option
        userSessionData[sessionID].selectedOption = userData;
        console.log("user selected", userData);

        userSessionData[sessionID].type = "miniBus";
        console.log("user selected car type", userSessionData[sessionID].type);
        continueSession = true; // Set to true to continue the session
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
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 4) {
    userSessionData[sessionID].selectedOption = userData;
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

    if (userSessionData[sessionID].service === "1") {
      // Check if the service is Third Party Commercial

      // Check if the selected option exists in the mapping
      if (userSessionData[sessionID].type === "maxBus") {
        if (
          maxBusServicePrices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            maxBusServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 23 - 70 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "hiringCars") {
        if (
          hiringCarsServicePrices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            hiringCarsServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 5 - 15 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "ambulanceOrHearse") {
        if (
          ambulanceOrHearseServicePrices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            ambulanceOrHearseServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Please input 5 to access this service.";
        }
      }
      // else if (userSessionData[sessionID].type === "specialOnSite") {
      //   if (
      //     onSiteSpecialTypesServicePrice.hasOwnProperty(
      //       userSessionData[sessionID].selectedOption
      //     )
      //   ) {
      //     service = userSessionData[sessionID].service;
      //     message =
      //       "Pay " +
      //       onSiteSpecialTypesServicePrice[
      //         userSessionData[sessionID].selectedOption
      //       ].toFixed(2);
      //     continueSession = true;
      //   } else {
      //     message = "Only numbers between 1 - 5 are allowed.";
      //   }
      // } else if (userSessionData[sessionID].type === "specialOnBoard") {
      //   if (
      //     onBoardSpecialTypesServicePrice.hasOwnProperty(
      //       userSessionData[sessionID].selectedOption
      //     )
      //   ) {
      //     service = userSessionData[sessionID].service;
      //     message =
      //       "Pay " +
      //       onBoardSpecialTypesServicePrice[
      //         userSessionData[sessionID].selectedOption
      //       ].toFixed(2);
      //     continueSession = true;
      //   } else {
      //     message = "Only numbers between 1 - 5 are allowed.";
      //   }
      // } else if (userSessionData[sessionID].type === "GW1Class1") {
      //   if (
      //     GW1Class1ServicePrice.hasOwnProperty(
      //       userSessionData[sessionID].selectedOption
      //     )
      //   ) {
      //     service = userSessionData[sessionID].service;
      //     message =
      //       "Pay " +
      //       GW1Class1ServicePrice[
      //         userSessionData[sessionID].selectedOption
      //       ].toFixed(2);
      //     continueSession = true;
      //   } else {
      //     message = "Only numbers between 1 - 5 are allowed.";
      //   }
      // } else if (userSessionData[sessionID].type === "GW1Class2") {
      //   if (
      //     GW1Class2ServicePrice.hasOwnProperty(
      //       userSessionData[sessionID].selectedOption
      //     )
      //   ) {
      //     service = userSessionData[sessionID].service;
      //     message =
      //       "Pay " +
      //       GW1Class2ServicePrice[
      //         userSessionData[sessionID].selectedOption
      //       ].toFixed(2);
      //     continueSession = true;
      //   } else {
      //     message = "Only numbers between 1 - 5 are allowed.";
      //   }
      // } else if (userSessionData[sessionID].type === "GW1Class3") {
      //   if (
      //     GW1Class3ServicePrice.hasOwnProperty(
      //       userSessionData[sessionID].selectedOption
      //     )
      //   ) {
      //     service = userSessionData[sessionID].service;
      //     message =
      //       "Pay " +
      //       GW1Class3ServicePrice[
      //         userSessionData[sessionID].selectedOption
      //       ].toFixed(2);
      //     continueSession = true;
      //   } else {
      //     message = "Only numbers between 1 - 5 are allowed.";
      //   }
      // }
      else if (userSessionData[sessionID].type === "artOrTankers") {
        if (
          artOrTankersServicePrices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            artOrTankersServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
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
          message =
            "Pay " +
            taxiServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
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
          message =
            "Pay " +
            miniBusServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Please input 5.";
        }
      }

      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].type === "specialTypes") {
          service = "1";
          message =
            "You selected Special Types(Z 802 ON SITE). Choose an option:\n";
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
    } else if (userSessionData[sessionID].service === "2") {
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
          message =
            "Pay " +
            privateIndividualX1Prices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only inputs from 5 - 12 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "privateIndividualX4") {
        // Check if the selected option exists in the mapping
        if (
          privateIndividualX4Prices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            privateIndividualX4Prices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only inputs from 5 - 12 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
        // Check if the selected option exists in the mapping
        if (
          ownGoodsBelow.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            ownGoodsBelow[userSessionData[sessionID].selectedOption].toFixed(2);
          continueSession = true;
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
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            ownGoodsAbove[userSessionData[sessionID].selectedOption].toFixed(2);
          continueSession = true;
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
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            generalGartageBelow[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
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
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            generalGartageAbove[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
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
          // Get the price dynamically from the mapping
          message =
            "Pay " +
            miniBusServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Please input a value between 5 - 22.";
        }
      } else {
        message = "Invalid option selected for Third Party Private.";
        continueSession = false;
      }
    } else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        // Check if the selected option exists in the mapping
        if (
          motorCycleServicePrices.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // motorCycleServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            motorCycleServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "5") {
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
            // "Pay " +
            // maxBusServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            maxBusServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // hiringCarsServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            hiringCarsServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // ambulanceOrHearseServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            ambulanceOrHearseServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // artOrTankersServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            artOrTankersServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // taxiServicePrices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            taxiServicePrices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      }

      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].type === "specialTypes") {
          service = "1";
          message =
            "You selected Special Types(Z 802 ON SITE). Choose an option:\n";
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
            // "Pay " +
            // privateIndividualX1Prices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            privateIndividualX1Prices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // privateIndividualX4Prices[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            privateIndividualX4Prices[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // ownGoodsBelow[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            ownGoodsBelow[userSessionData[sessionID].selectedOption].toFixed(2);
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
            // "Pay " +
            // ownGoodsAbove[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            ownGoodsAbove[userSessionData[sessionID].selectedOption].toFixed(2);
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
            // "Pay " +
            // generalGartageBelow[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            generalGartageBelow[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
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
            // "Pay " +
            // generalGartageAbove[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            generalGartageAbove[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      }
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 5) {
    userSessionData[sessionID].thirdPartyPrice;
    userSessionData[sessionID].carPrice = userData;

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
    if (userSessionData[sessionID].service === "1") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        if (
          onSiteSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            onSiteSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        if (
          onBoardSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            onBoardSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        if (
          GW1Class1ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            GW1Class1ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        if (
          GW1Class2ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            GW1Class2ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        if (
          GW1Class3ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          message =
            "Pay " +
            GW1Class3ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        } else {
          message = "Only numbers between 1 - 5 are allowed.";
        }
      }
    } else if (userSessionData[sessionID].service === "4") {
      if (userSessionData[sessionID].type === "motorCycle") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive co-oporate motor cycle is",
          totalPrice
        );
        continueSession = true;
      }
    } else if (userSessionData[sessionID].service === "5") {
      if (userSessionData[sessionID].type === "maxiBus") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive commercial maxi bus is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "hiring") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive commercial hiring cars is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ambulance") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive commercial ambulance/hearse is",
          totalPrice
        );
        continueSession = true;
      }
      // else if (userSessionData[sessionID].type === "onSiteSpecial") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 1.5) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     message = `Pay ${totalPrice}`;
      //   }

      //   console.log(
      //     "3rd party price is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);

      //   console.log(
      //     "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
      //     totalPrice
      //   );
      //   continueSession = true;
      // }
      // else if (userSessionData[sessionID].type === "onBoardSpecial") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     message = `Pay ${totalPrice}`;
      //   }

      //   console.log(
      //     "3rd party price is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);

      //   console.log(
      //     "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
      //     totalPrice
      //   );
      //   continueSession = true;
      // }
      // else if (userSessionData[sessionID].type === "gw1Class1") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     message = `Pay ${totalPrice}`;
      //   }

      //   console.log(
      //     "3rd party price is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);

      //   console.log(
      //     "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
      //     totalPrice
      //   );
      //   continueSession = true;
      // }
      // else if (userSessionData[sessionID].type === "gw1Class2") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     message = `Pay ${totalPrice}`;
      //   }

      //   console.log(
      //     "3rd party price is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);

      //   console.log(
      //     "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
      //     totalPrice
      //   );
      //   continueSession = true;
      // }
      // else if (userSessionData[sessionID].type === "gw1Class3") {
      //   const totalPrice =
      //     parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
      //     parseInt(userSessionData[sessionID].thirdPartyPrice);
      //   if (userSessionData[sessionID].carPrice < 50000) {
      //     message = "The car value cannot be less than 50000 GHS";
      //   } else {
      //     message = `Pay ${totalPrice}`;
      //   }

      //   console.log(
      //     "3rd party price is ",
      //     userSessionData[sessionID].thirdPartyPrice
      //   );
      //   console.log("And car value is", userSessionData[sessionID].carPrice);

      //   console.log(
      //     "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
      //     totalPrice
      //   );
      //   continueSession = true;
      // }
      else if (userSessionData[sessionID].type === "artOrTanker") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 8) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive commercial art/tankers is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "Taxi") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive commercial taxi is",
          totalPrice
        );
        continueSession = true;
      }
      if (userSessionData[sessionID].type === "specialOnSite") {
        // if (
        //   onSiteSpecialTypesServicePrice.hasOwnProperty(
        //     userSessionData[sessionID].selectedOption
        //   )
        // ) {
        //   service = userSessionData[sessionID].service;
        //   message =
        //     "Pay " +
        //     onSiteSpecialTypesServicePrice[
        //       userSessionData[sessionID].selectedOption
        //     ].toFixed(2);
        //   continueSession = true;
        // } else {
        //   message = "Only numbers between 1 - 5 are allowed.";
        // }
        // Check if the selected option exists in the mapping
        if (
          onSiteSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // onSiteSpecialTypesServicePrice[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            onSiteSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }

        // continue here
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        if (
          onBoardSpecialTypesServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // onBoardSpecialTypesServicePrice[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            onBoardSpecialTypesServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        if (
          GW1Class1ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // GW1Class1ServicePrice[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            GW1Class1ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        if (
          GW1Class2ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // GW1Class2ServicePrice[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            GW1Class2ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        if (
          GW1Class3ServicePrice.hasOwnProperty(
            userSessionData[sessionID].selectedOption
          )
        ) {
          service = userSessionData[sessionID].service;
          // Get the price dynamically from the mapping
          message =
            // "Pay " +
            // GW1Class3ServicePrice[
            //   userSessionData[sessionID].selectedOption
            // ].toFixed(2) +
            "Please enter the value of your car";
          userSessionData[sessionID].thirdPartyPrice =
            GW1Class3ServicePrice[
              userSessionData[sessionID].selectedOption
            ].toFixed(2);
          continueSession = true;
        }
      }
    } else if (userSessionData[sessionID].service === "6") {
      if (userSessionData[sessionID].type === "privateX1") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "privateX4") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsBelow3000") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      } else if (userSessionData[sessionID].type === "ownGoodsAbove3000") {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 4) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageBelow3000"
      ) {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      } else if (
        userSessionData[sessionID].type === "generalCartageAbove3000"
      ) {
        const totalPrice =
          parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
          parseInt(userSessionData[sessionID].thirdPartyPrice);
        if (userSessionData[sessionID].carPrice < 50000) {
          message = "The car value cannot be less than 50000 GHS";
        } else {
          message = `Pay ${totalPrice}`;
        }

        console.log(
          "3rd party price is ",
          userSessionData[sessionID].thirdPartyPrice
        );
        console.log("And car value is", userSessionData[sessionID].carPrice);

        console.log(
          "Total amount to be paid for comprehensive private individual X1 is",
          totalPrice
        );
        continueSession = true;
      }
    }

    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 6) {
    userSessionData[sessionID].thirdPartyPrice;
    userSessionData[sessionID].carPrice = userData;

    if (userSessionData[sessionID].type === "specialOnSite") {
      const totalPrice =
        parseInt(userSessionData[sessionID].carPrice * 1.5) / 100 +
        parseInt(userSessionData[sessionID].thirdPartyPrice);
      if (userSessionData[sessionID].carPrice < 50000) {
        message = "The car value cannot be less than 50000 GHS";
      } else {
        message = `Pay ${totalPrice}`;
      }

      console.log(
        "3rd party price is ",
        userSessionData[sessionID].thirdPartyPrice
      );
      console.log("And car value is", userSessionData[sessionID].carPrice);

      console.log(
        "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
        totalPrice
      );
      continueSession = true;
    } else if (userSessionData[sessionID].type === "specialOnRoad") {
      const totalPrice =
        parseInt(userSessionData[sessionID].carPrice * 3) / 100 +
        parseInt(userSessionData[sessionID].thirdPartyPrice);
      if (userSessionData[sessionID].carPrice < 50000) {
        message = "The car value cannot be less than 50000 GHS";
      } else {
        message = `Pay ${totalPrice}`;
      }

      console.log(
        "3rd party price is ",
        userSessionData[sessionID].thirdPartyPrice
      );
      console.log("And car value is", userSessionData[sessionID].carPrice);

      console.log(
        "Total amount to be paid for comprehensive commercial special type (ON SITE) is",
        totalPrice
      );
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS1") {
      const totalPrice =
        parseInt(userSessionData[sessionID].carPrice * 5) / 100 +
        parseInt(userSessionData[sessionID].thirdPartyPrice);
      if (userSessionData[sessionID].carPrice < 50000) {
        message = "The car value cannot be less than 50000 GHS";
      } else {
        message = `Pay ${totalPrice}`;
      }

      console.log(
        "3rd party price is ",
        userSessionData[sessionID].thirdPartyPrice
      );
      console.log("And car value is", userSessionData[sessionID].carPrice);

      console.log(
        "Total amount to be paid for comprehensive commercial GW1 (CLASS 1) is",
        totalPrice
      );
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS2") {
      const totalPrice =
        parseInt(userSessionData[sessionID].carPrice * 6) / 100 +
        parseInt(userSessionData[sessionID].thirdPartyPrice);
      if (userSessionData[sessionID].carPrice < 50000) {
        message = "The car value cannot be less than 50000 GHS";
      } else {
        message = `Pay ${totalPrice}`;
      }

      console.log(
        "3rd party price is ",
        userSessionData[sessionID].thirdPartyPrice
      );
      console.log("And car value is", userSessionData[sessionID].carPrice);

      console.log(
        "Total amount to be paid for comprehensive commercial GW1 (CLASS 2) is",
        totalPrice
      );
      continueSession = true;
    } else if (userSessionData[sessionID].type === "GW1CLASS3") {
      const totalPrice =
        parseInt(userSessionData[sessionID].carPrice * 7) / 100 +
        parseInt(userSessionData[sessionID].thirdPartyPrice);
      if (userSessionData[sessionID].carPrice < 50000) {
        message = "The car value cannot be less than 50000 GHS";
      } else {
        message = `Pay ${totalPrice}`;
      }

      console.log(
        "3rd party price is ",
        userSessionData[sessionID].thirdPartyPrice
      );
      console.log("And car value is", userSessionData[sessionID].carPrice);

      console.log(
        "Total amount to be paid for comprehensive commercial GW1 (CLASS 3) is",
        totalPrice
      );
      continueSession = true;
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
