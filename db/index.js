const mongoose = require("mongoose")

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