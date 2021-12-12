const userModel = require("./../../db/models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_RESET_KEY = process.env.SECRET_RESET_KEY;

const CLIENT_URL = "http://localhost:3000"; 

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
          "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
          "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
          "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
          refresh_token:
            "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
        });
        const accessToken = oauth2Client.getAccessToken();

        const token = jwt.sign({ username, email, password }, SECRET_KEY, {
          expiresIn: "30m",
        });

        const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "nodejsa@gmail.com",
            clientId:
              "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
            clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
            refreshToken:
              "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
            accessToken: accessToken,
          },
        });

        const mailOptions = {
          from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Account Verification: NodeJS Auth ✔", // Subject line
          generateTextFromHTML: true,
          html: output, // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(200).json({
              err: "Something went wrong on our end. Please register again.",
            });
          } else {
            console.log("Mail sent : %s", info.response);
            res.status(200).json({
              message:
                "Activation link sent to email ID. Please activate to log in.",
            });
          }
        });
      }
    });
  }
};

const activate = (req, res) => {
  const token = req.params.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err) {
        res.json({ err: "Incorrect or expired link! Please register again." });
      } else {
        const { username, email, password } = decodedToken;
        userModel.findOne({ email: email }).then((user) => {
          if (user) {
            res.json({ err: "Email ID already registered! Please log in." });
          } else {
            const newUser = new userModel({
              username,
              email,
              password,
            });

            bcryptjs.genSalt(10, (err, salt) => {
              bcryptjs.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    res.json({success: user});
                  })
                  .catch((err) => console.log(err));
              });
            });
          }
        });
      }
    });
  } else {
    console.log("Account activation error!");
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  let errors = [];

  if (!email) {
    errors.push({ msg: "Please enter an email ID" });
  }

  if (errors.length > 0) {
    res.json({ errors });
  } else {
    userModel.findOne({ email: email }).then((user) => {
      if (!user) {
        errors.push({ msg: "User with Email ID does not exist!" });
        res.json({ errors });
      } else {
        const oauth2Client = new OAuth2(
          "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
          "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
          "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
          refresh_token:
            "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
        });
        const accessToken = oauth2Client.getAccessToken();

        const token = jwt.sign({ _id: user._id }, SECRET_RESET_KEY, {
          expiresIn: "30m",
        });
        const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

        userModel.updateOne({ resetLink: token }, (err, success) => {
          if (err) {
            errors.push({ msg: "Error resetting password!" });
            res.json({ errors });
          } else {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                type: "OAuth2",
                user: "nodejsa@gmail.com",
                clientId:
                  "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                refreshToken:
                  "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                accessToken: accessToken,
              },
            });

            const mailOptions = {
              from: '"Auth Admin" <nodejsa@gmail.com>', 
              to: email, 
              subject: "Account Password Reset: NodeJS Auth ✔", 
              html: output, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                errors.push({
                  msg: "Something went wrong on our end. Please try again later.",
                });
                res.json({ errors });
              } else {
                console.log("Mail sent : %s", info.response);
                res.json({
                  success:
                    "Password reset link sent to email ID. Please follow the instructions.",
                });
              }
            });
          }
        });
      }
    });
  }
};

const gotoReset = (req, res) => {
  const { token } = req.params;

  if (token) {
    jwt.verify(token, SECRET_RESET_KEY, (err, decodedToken) => {
      if (err) {
        res.json({ error: "Incorrect or expired link! Please try again." });
      } else {
        const { _id } = decodedToken;
        userModel.findById(_id, (err, user) => {
          if (err) {
            res.json({ error: "User with email ID does not exist! Please try again." });
          } else {
            res.json({ success: _id});
          }
        });
      }
    });
  } else {
    console.log("Password reset error!");
  }
};
///set passord
const resetPassword = (req, res) => {
  var { password, password2 } = req.body;
  const id = req.params.id;

  if (!password || !password2) {
    res.json({error:"Please enter all fields."});
  }

  else if (password.length < 8) {
    res.json({error:"Password must be at least 8 characters."});
  }
  else if (password != password2) {
    res.json({error:"Passwords does not match."});
  } else {
    bcryptjs.genSalt(10, (err, salt) => {
      bcryptjs.hash(password, salt, (err, hash) => {
        if (err) throw err;
        password = hash;

        userModel.findByIdAndUpdate(
          { _id: id },
          { password },
          function (err, result) {
            if (err) {
              res.json({error:"Error resetting password!"});
            } else {
              res.json({error:"Password reset successfully!"});
            }
          }
        );
      });
    });
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/login/success",
    failureRedirect: "/login/err",
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout();
  res.json({logout: 'You are logged out'});
};

module.exports = {
  register,
  login,
  getUsers,
  removeUser,
  activate,
  logout,
  resetPassword,
  gotoReset,
  forgotPassword,
};