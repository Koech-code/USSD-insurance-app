// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require("cors");

// require("dotenv").config();

// const arkeselUssdRoutes = require("./routes/ussdRoute");

// const app = express();
// const port = 5000;
// // Enable CORS for all routes
// app.use(cors());

// app.use(bodyParser.json());

// // Mount the Arkesel USSD routes
// app.use("/", arkeselUssdRoutes);

// // Root route to serve the HTML file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require("cors");
// const https = require("https");
// const fs = require("fs");

// require("dotenv").config();

// const arkeselUssdRoutes = require("./routes/ussdRoute");

// const app = express();
// const port = 5000;

// // Enable CORS for all routes
// app.use(cors());

// app.use(bodyParser.json());

// // Mount the Arkesel USSD routes
// app.use("/", arkeselUssdRoutes);

// // Root route to serve the HTML file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// // HTTPS options
// const httpsOptions = {
//   key: fs.readFileSync("./ssl/server.key"),
//   cert: fs.readFileSync("./ssl/server.crt"),
// };

// // Start the HTTPS server
// https.createServer(httpsOptions, app).listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http"); // Require HTTP module
const https = require("https");
const fs = require("fs");

require("dotenv").config();

const arkeselUssdRoutes = require("./routes/ussdRoute");

const app = express();
const httpsPort = process.env.HTTPS_PORT;
const httpPort = process.env.HTTP_PORT; // Different port for HTTP

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Mount the Arkesel USSD routes
app.use("/", arkeselUssdRoutes);

// Root route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.crt"),
};

// Create HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

// Start the HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server is running on port ${httpsPort}`);
});

// Create HTTP server
const httpServer = http.createServer(app);

// Start the HTTP server
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server is running on port ${httpPort}`);
});
