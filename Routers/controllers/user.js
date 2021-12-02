// const User = require("./../../db/models/post");
const bcrypt = require("bcrypt")
require("dotenv").config()
const SALT = Number(process.env.SALT)
const userModel = require("./../../db/models/user")
//const _ =require("lodash");
//const formidable = require("formidable");
//const fs = require("fs");


const register = async (req, res) => {
    const { email, password,name } = req.body;
    
    const savedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, SALT);
    
    const newUser = new userModel({
      email: savedEmail,
      password: hashedPassword,
      name
      
    });
    newUser
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };
  // logiiin
  const login = (req, res) => {
    const { email, password } = req.body;
    const SECRET_KEY = process.env.SECRET_KEY;
    userModel
      .findOne({ email })
      .then(async (result) => {
        if (result) {
          if (email === result.email) {
            const payload={
              role:result.role
            }
            const options={
              expiresIn: 60*60
            }
            const token = await jwt.sign(payload, SECRET_KEY, options)
            console.log(token);
  
            const unhashPassword = await bcrypt.compare(password, result.password)
  
            if (unhashPassword) {
              res.status(200).json(result);
            } else {
              res.status(400).json("invalid email or password");
            }
          } else {
            res.status(400).json("invalid email or password");
          }
        } else {
          res.status(400).json("email does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
    };


const getUser = (req,res,next,id) =>{
   req.profile.hashed_password = undefined
   req.profile.salt = undefined
   res.json(req.profile);

};


 module.exports={
    register, 
    login, 
    getUser 
 }