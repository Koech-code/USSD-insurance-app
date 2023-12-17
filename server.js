// // const express = require("express");
// // const app = express();
// // const port = 3000;

// // const http = require("http");
// // const httpServer = http.createServer(app);

// // require("dotenv").config();
// // const PORT = process.env.PORT;
// // // Define a route
// // app.get("/", (req, res) => {
// //   res.send("API is running!");
// // });

// // var ussdRouter = require("./routes/ussdRoutes");
// // app.use(ussdRouter);
// // // Start the server
// // httpServer.listen(PORT, () => {
// //   console.log(`HTTP server is listening on port ${PORT}`);
// // });

// // module.exports = app;

// const express = require("express");
// const app = express();
// const port = 3000;

// const http = require("http");
// const httpServer = http.createServer(app);

// require("dotenv").config();
// const PORT = process.env.PORT;

// // Middleware to parse URL-encoded form data
// app.use(express.urlencoded({ extended: true }));

// // Middleware to parse JSON data
// app.use(express.json());

// // Define a route
// app.get("/", (req, res) => {
//   res.send("API is running!");
// });

// var ussdRouter = require("./routes/ussdRoutes");
// app.use(ussdRouter);

// // Start the server
// httpServer.listen(PORT, () => {
//   console.log(`HTTP server is listening on port ${PORT}`);
// });

// module.exports = app;

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const arkeselUssdRoutes = require("./routes/ussdRoute");

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Mount the Arkesel USSD routes
app.use("/", arkeselUssdRoutes);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
