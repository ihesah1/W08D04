const userModel = require("./../../db/models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

///get ausers 
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
////remove users

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
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const SALT = Number(process.env.SALT);
  const savedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, SALT);
  const newUser = new userModel({
    username: username,
    email: savedEmail,
    password: hashedPassword,
    role,
  });
  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

const login = (req, res) => {
  const { username, email, password } = req.body;
  const SECRET_KEY = process.env.SECRET_KEY;
  const savedEmail = email?.toLowerCase();

  //here we check either (email or username) entered are true
  userModel
    .findOne({$or: [
      {email:savedEmail},
      {username}
  ]}).populate('role').then(async (result) => {
      if (result) {
        if (savedEmail === result.email || username === result.username) {
          const payload = {
            id: result._id,
            role: result.role,
          };
          const options = {
            expiresIn: 60 * 60,
          };
          const token = jwt.sign(payload, SECRET_KEY, options);
          const unhashPassword = await bcrypt.compare(
            password,
            result.password
          );
          if (unhashPassword) {
            res.status(200).json({result, token});
          } else {
            res.status(200).json("invalid email or password");
          }
        } else {
          res.status(200).json("invalid email or password");
        }
      } else {
        res.status(200).json("email does not exist");
      }
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

module.exports = { register, login, getUsers, removeUser };
