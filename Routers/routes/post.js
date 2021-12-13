const express = require('express')
const  {getPosts ,getPostById, createPost, updatePost, deletePost, giveLikeOrRemove, getPostsForAdmin} = require('./../controllers/post')
const postRouter = express.Router()
const authentication = require("../middlewares/authentication");
postRouter.get("/posts",authentication, getPosts);
postRouter.get("/posts/admin",authentication, getPostsForAdmin);
postRouter.get("/posts/:id",authentication, getPostById);
postRouter.post("/post",authentication, createPost);
postRouter.put("/post/:id", authentication, updatePost);
postRouter.delete("/post/:id",authentication, deletePost);
postRouter.post("/likePost/:id",authentication, giveLikeOrRemove);
module.exports = postRouter;