const express = require("express");
const { createRole, roles } = require("./../controllers/role");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const roleRouter = express.Router();


roleRouter.post("/createrole",authentication, authorization, createRole);
roleRouter.get("/roles",authentication, authorization, roles);


module.exports = roleRouter;