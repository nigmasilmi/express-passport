const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
require("dotenv").config();
require("colors");

//DB Setup
mongoose.connect(
  `mongodb+srv://authPlaygDBUser:${process.env.DB_PASS}@cluster0.zsbhn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Testing the connection
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open ".bgGreen.black);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: ".bgRed.white + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

console.log("process", process.env.DB_PASS);
// App setup
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on port: ${port}`.bgBlue.black);
