const userModel = require("./../../db/models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_RESET_KEY = process.env.SECRET_RESET_KEY;

const CLIENT_URL = "http://localhost:4000"; 
const getUsers = (req, res) => {
  userModel
    .find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const removeUser = (req, res) => {
  const { id } = req.params;
  userModel
    .findByIdAndUpdate(id, { $set: { isDeleted: true } })
    .then((result) => {
      if (result) {
        res.status(200).json("user removed");
      } else {
        res.status(200).json("user does not exist");
      }
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

const register = (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }

  if (errors.length > 0) {
    res.status(200).json({
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    userModel.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email ID already registered" });
        res.status(200).json({
          errors,
          username,
          email,
          password,
          password2,
        });
      } else {
        const oauth2Client = new OAuth2(
          // ClientID
          // Client Secret
          // Redirect URL
        );

        oauth2Client.setCredentials({
        
        });
        const accessToken = oauth2Client.getAccessToken();

        const token = jwt.sign({ username, email, password }, SECRET_KEY, {
          expiresIn: "30m",
        });

        // const output = `
        //         <h2>Please click on below link to activate your account</h2>
        //         <p>${CLIENT_URL}/activate/${token}</p>
        //         <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
        //         `;

       

       
          }
        });
      }
    });
  }
};



module.exports = {
  register,
  login,
  getUsers,
  removeUser
};