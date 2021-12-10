const mongoose = require('mongoose')
require('dotenv').config()
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
//import and configure the dotenv package
const DB = process.env.DB;
mongoose.connect(`mongodb://localhost:27017/${DB}`, options).then(
  () => {
    console.log("DB Ready To Use");
  },
  (err) => {
    console.log(err);
  }
);
