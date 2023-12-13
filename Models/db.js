const { default: mongoose } = require("mongoose");
require("dotenv").config();
const URL = process.env.URL;
const connection = mongoose.connect(URL);
if (connection) {
  console.log("connected");
}

module.exports = { connection };
