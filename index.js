const express = require("express");
const dotenv =require("dotenv")
const helmet=require("helmet")
const morgan = require("morgan")
require("dotenv").config();
require("./db")
const cors = require("cors");
const userRoutes = require("./Routers/routes/user");
const postRoutes = require("./Routers/routes/post");
const commentRoutes = require("./routers/routes/comment");
const roleRoutes = require('./routers/routes/role');

let bodyParser = require('body-parser');
//instatite
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(bodyParser.json());


//use routes 
app.use( userRoutes);
app.use( postRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
