if (userSessionData[sessionID].selectedOption === "1") {
  // Check if the user input exists in the mapping
  if (maxBusServicePrices.hasOwnProperty(userSessionData[sessionID].service)) {
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
    hiringCarsServicePrices.hasOwnProperty(userSessionData[sessionID].service)
  ) {
    service = userSessionData[sessionID].service;
    // Get the price dynamically from the mapping
    message = "Pay " + hiringCarsServicePrices[service].toFixed(2);
    continueSession = true;
  } else if (
    !hiringCarsServicePrices.hasOwnProperty(userSessionData[sessionID].service)
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
    !GW1Class1ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
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
    !GW1Class2ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
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
    !GW1Class3ServicePrice.hasOwnProperty(userSessionData[sessionID].service)
  ) {
    message =
      "The number you entered is out of range. GW1 (Class 3) holds only 1 - 5 persons";
    continueSession = false;
  }
} else if (userSessionData[sessionID].selectedOption === "9") {
  // Check if the user input exists in the ambulance/hearse mapping
  if (
    artOrTankersServicePrices.hasOwnProperty(userSessionData[sessionID].service)
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
  if (taxiServicePrices.hasOwnProperty(userSessionData[sessionID].service)) {
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
