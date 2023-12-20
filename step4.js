else if (newSession === false && userSessionData[sessionID].step === 4) {
    userSessionData[sessionID].selectedOption = userData;

    if (userSessionData[sessionID].service === "1") {
      // Check if the service is Third Party Commercial
      const maxBusServicePrices = {
        23: 849.0,
        24: 861.0,
        25: 873.0,
        // Add more options as needed
      };

      // Check if the selected option exists in the mapping
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