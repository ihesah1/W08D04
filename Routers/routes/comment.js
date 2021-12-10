const express = require("express");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("./../controllers/comment");
const commentRouter = express.Router();
const authentication = require("../middlewares/authentication");

commentRouter.post("/comment/:id", authentication, createComment);
commentRouter.put("/comment/:id", authentication, updateComment);
commentRouter.delete("/comment/:id", authentication, deleteComment);

module.exports = commentRouter;
