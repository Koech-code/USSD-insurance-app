// const mongoose = require("mongoose");

// const PaymentResponse = new mongoose.Schema({
//   amount: {
//     type: String,
//     rquired: true,
//   },
//   paymentStatus: {
//     type: String,
//     rquired: true,
//   },
//   customerNumber: {
//     type: String,
//     rquired: true,
//   },
// });

// module.exports = mongoose.model("PaymentResponse", PaymentResponse);

const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../scripts/config.js");

class PaymentResponse extends Model {}
PaymentResponse.init(
  {
    status: DataTypes.STRING,
    message: DataTypes.STRING,
    transactionID: DataTypes.STRING,

    createdBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "PaymentResponse", freezeTableName: true }
);

PaymentResponse.sync({ alter: true })
  .then(() => {
    console.log("PaymentResponse table created successfully");
  })
  .catch((error) => {
    console.log(`Error creating PaymentResponse table: ${error}`);
  });
module.exports = { PaymentResponse };
