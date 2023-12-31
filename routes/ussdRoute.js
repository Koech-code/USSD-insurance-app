const express = require("express");
const router = express.Router();
const juni = require("../controllers/paymentController.js");
const PaymentResponse = require("../models/paymentResponseModel.js");
const USSDCODE = "*928*311#";
const userSessionData = {};

router.post("/ussd", async (req, res) => {
  const { sessionID, newSession, msisdn, userData, userID, network } = req.body;
           var carname = await juni.verify(msisdn);
  // Replace "233" with "0" in the msisdn variable
const formattedMsisdn = msisdn.replace(/^233/, '0');

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
      // phonenumber: undefined,
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
      // Renew insurance menu
      service = "2";
      message = "Select a package to renew\n";
      message += "1. 3rd party Comm.\n";
      message += "2. 3rd party Private\n";
      message += "3. Motor Cycle\n";
      message += "4. Comp. Co-oprate\n";
      message += "5. Comp. Commercial\n";
      message += "6. Comp. Private";
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
      23: 1.0,
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
    if (userSessionData[sessionID].service === "1") {
      // Check if the service is Third Party Commercial

      if (userSessionData[sessionID].InsuranceType === "purchase") {
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
              `${carname.name} will receive a prompt to authorize payment of ` +
              maxBusServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now `;
              let amount = parseInt( maxBusServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Max Bus car."
              );
            continueSession = false;
          } else {
            message = "Only numbers between 23 - 70 are allowed.";
            continueSession = false;
          }
        } else if (userSessionData[sessionID].type === "hiringCars") {
          if (
            hiringCarsServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
             `${carname.name} will receive a prompt to authorize payment of ` +
              hiringCarsServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
                   let amount = parseInt(hiringCarsServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Hiring car."
              );
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
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              ambulanceOrHearseServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
                  let amount = parseInt(ambulanceOrHearseServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Ambulance/Hearse car."
              );
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
            message =
             `${carname.name} will receive a prompt to authorize payment of ` +
              artOrTankersServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
                   let amount = parseInt(artOrTankersServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Art/Tankers car."
              );
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
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              taxiServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
              let amount = parseInt(taxiServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Taxi car."
              );
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
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              miniBusServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
             let amount = parseInt(miniBusServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Purchasing a 3rd party commercial insurance package for a Mini Bus car."
              );
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        }
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "maxBus") {
          if (
            maxBusRenewalServicePrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              maxBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2)  + ` now.`;
              let amount = parseInt(miniBusServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for a Max Bus car."
              );
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
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              hiringCarsRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
             let amount = parseInt(hiringCarsRenewalServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for a Hiring car."
              );
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
            message =
             `${carname.name} will receive a prompt to authorize payment of ` +
              ambulanceOrHearseRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2)  + ` now.`;
            let amount = parseInt(ambulanceOrHearseRenewalServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for an Ambulance/Hearse car."
              );
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
            message =
               `${carname.name} will receive a prompt to authorize payment of ` +
              artOrTankersRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2)  + ` now.`;
                let amount = parseInt(artOrTankersRenewalServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for an Art/Tanker car."
              );
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
            message =
               `${carname.name} will receive a prompt to authorize payment of ` +
              taxiRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2)  + ` now.`;
               let amount = parseInt(taxiRenewalServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for a Taxi car."
              );
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
            message =
              `${carname.name} will receive a prompt to authorize payment of ` +
              miniBusRenewalServicePrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2) + ` now.`;
            let amount = parseInt(miniBusRenewalServicePrices[
                  userSessionData[sessionID].selectedOption
                ]);
              await juni.pay(
                amount,
                amount,
                formattedMsisdn,
                "Renewing a 3rd party commercial insurance package for a Mini Bus car."
              );
            continueSession = false;
          } else {
            message = "Please input 5.";
          }
        }
      }
      // step 4 for special types and GW1
      if (userSessionData[sessionID].selectedOption === "1") {
        if (userSessionData[sessionID].type === "specialTypes") {
          if (userSessionData[sessionID].InsuranceType === "purchase") {
            service = "1";
            message =
              "You're about to purchase Special Types(Z 802 ON SITE) 3rd party insurance package. Enter the exact passenger number(e.g 2)\n";
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
              ownGoodsBelow[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
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
              ownGoodsAbove[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
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
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              privateIndividualX1RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
          }
        } else if (userSessionData[sessionID].type === "privateIndividualX4") {
          // Check if the selected option exists in the mapping
          if (
            privateIndividualX4RenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              privateIndividualX4RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only inputs from 5 - 12 are allowed.";
          }
        } else if (userSessionData[sessionID].type === "ownGoodsBelow") {
          // Check if the selected option exists in the mapping
          if (
            ownGoodsBelowRenewalPrices.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              ownGoodsBelowRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
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
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              ownGoodsAboveRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
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
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              generalCartageRenewalBelow[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
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
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              generalCartageRenewalAbove[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
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
            // Get the price dynamically from the mapping
            message =
              "Pay " +
              miniBusRenewalServicePrices[
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
              ownGoodsBelow[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
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
              ownGoodsAbove[userSessionData[sessionID].selectedOption].toFixed(
                2
              );
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
              // "Pay " +
              // privateIndividualX1RenewalPrices[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX1RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
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
              // "Pay " +
              // privateIndividualX4RenewalPrices[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              privateIndividualX4RenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
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
              // "Pay " +
              // ownGoodsBelowRenewalPrices[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsBelowRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
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
              // "Pay " +
              // ownGoodsAboveRenewalPrices[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              ownGoodsAboveRenewalPrices[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
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
              // "Pay " +
              // generalCartageRenewalBelow[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              generalCartageRenewalBelow[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
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
              // "Pay " +
              // generalCartageRenewalAbove[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              generalCartageRenewalAbove[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }
        }
      }
    }
    // Increment the step for the next interaction
    userSessionData[sessionID].step = userSessionData[sessionID].step + 1;
  } else if (newSession === false && userSessionData[sessionID].step === 5) {
    userSessionData[sessionID].thirdPartyPrice;
    userSessionData[sessionID].carPrice = userData;
    // Purchase prices for third party
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
    if (userSessionData[sessionID].service === "1") {
      if (userSessionData[sessionID].type === "specialOnSite") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
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
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (
            onSiteSpecialTypesRenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
              "Pay " +
              onSiteSpecialTypesRenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only numbers between 1 - 5 are allowed.";
          }
        }
      } else if (userSessionData[sessionID].type === "specialOnRoad") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
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
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (
            onBoardSpecialTypesRenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
              "Pay " +
              onBoardSpecialTypesRenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only numbers between 1 - 5 are allowed.";
          }
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS1") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
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
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (
            GW1Class1RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
              "Pay " +
              GW1Class1RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only numbers between 1 - 5 are allowed.";
          }
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS2") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
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
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (
            GW1Class2RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
              "Pay " +
              GW1Class2RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only numbers between 1 - 5 are allowed.";
          }
        }
      } else if (userSessionData[sessionID].type === "GW1CLASS3") {
        if (userSessionData[sessionID].InsuranceType === "purchase") {
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
        } else if (userSessionData[sessionID].InsuranceType === "renewal") {
          if (
            GW1Class3RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            message =
              "Pay " +
              GW1Class3RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          } else {
            message = "Only numbers between 1 - 5 are allowed.";
          }
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

      // comprehensive renewal
      if (userSessionData[sessionID].InsuranceType === "purchase") {
        if (userSessionData[sessionID].type === "specialOnSite") {
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
      } else if (userSessionData[sessionID].InsuranceType === "renewal") {
        if (userSessionData[sessionID].type === "specialOnSite") {
          if (
            onSiteSpecialTypesRenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              // "Pay " +
              // onSiteSpecialTypesRenewalServicePrice[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              onSiteSpecialTypesRenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }

          // continue here
        } else if (userSessionData[sessionID].type === "specialOnRoad") {
          if (
            onBoardSpecialTypesRenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              // "Pay " +
              // onBoardSpecialTypesRenewalServicePrice[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              onBoardSpecialTypesRenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "GW1CLASS1") {
          if (
            GW1Class1RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              // "Pay " +
              // GW1Class1RenewalServicePrice[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              GW1Class1RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "GW1CLASS2") {
          if (
            GW1Class2RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              // "Pay " +
              // GW1Class2RenewalServicePrice[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              GW1Class2RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }
        } else if (userSessionData[sessionID].type === "GW1CLASS3") {
          if (
            GW1Class3RenewalServicePrice.hasOwnProperty(
              userSessionData[sessionID].selectedOption
            )
          ) {
            service = userSessionData[sessionID].service;
            // Get the price dynamically from the mapping
            message =
              // "Pay " +
              // GW1Class3RenewalServicePrice[
              //   userSessionData[sessionID].selectedOption
              // ].toFixed(2) +
              "Please enter the value of your car";
            userSessionData[sessionID].thirdPartyPrice =
              GW1Class3RenewalServicePrice[
                userSessionData[sessionID].selectedOption
              ].toFixed(2);
            continueSession = true;
          }
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
