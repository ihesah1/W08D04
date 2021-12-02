const express = require("express");
const {getUser, login,register }=require("../controllers/user");
const router = express.Router();

router.post("/users/create",register);
router.get("/user/:userId",getUser);
router.post("/user/login",login);





module.exports = router ;