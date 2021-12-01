const express = require("express");
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const helmet=require("helmet")
const morgan = require("morgan")
require("dotenv").config();
const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cors());



const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const DB = process.env.DB;
//connect to database
mongoose.connect(`mongodb://localhost:27017/${DB}`, options).then(
  () => {
    console.log("DB Ready To Use");
  },
  (err) => {
    console.log(err);
  }
);








const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
