const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

require("dotenv").config();
// const mongoose = require("mongoose");

// // mongoose database connection
// async function connectToDatabase() {
//   try {
//     await mongoose.connect(process.env.DB_CONNECTION);
//     console.log("Mongo DB connected");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// connectToDatabase();

const arkeselUssdRoutes = require("./routes/ussdRoute");

const app = express();
const port = 5000;
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Mount the Arkesel USSD routes
app.use("/", arkeselUssdRoutes);

// Root route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
