const postModel = require("../../db/models/post");
const likeModel = require("../../db/models/like");
const roleModel = require("../../db/models/role");
const commentModel = require("../../db/models/comment");


const getPostsForAdmin = (req, res) => {
  postModel
    .find({ isDeleted: false })
    .populate({path:"user comment like", match:{isDeleted:false}})
    .then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(200).json("no posts found");
      }
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

const getPosts = (req, res) => {
  console.log('im hereeeeeeeeeeee');
  postModel
    .find({ isDeleted: false })
    .populate({path:"user comment like", match:{isDeleted:false}})
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(200).json("no posts found");
      }
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

const createPost = (req, res) => {
  const { desc, img, isDeleted } = req.body;
  const newPost = new postModel({ desc, img, isDeleted, user: req.token.id });
  console.log(req.token);
  newPost
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  postModel.find({ _id: id, isDeleted: false })
  .populate({path:"user comment like", match:{isDeleted:false}})
  .then((result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(200).json("no post found");
    }
  }).catch((err) => {
    res.status(200).json(err);
  });;

};

const deletePost = async (req, res) => {
  const { id } = req.params;
  let sameUser = false;

  await postModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
    }
  }).catch((err) => {
    res.status(200).json(err);
  });;

  const result = await roleModel.findById(req.token.role);
  if (result.role == "admin" || sameUser) {
    postModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } })
      .then((result) => {
        if (result) {
          res.status(200).json("post removed");
        } else {
          res.status(200).json("post does not exist");
        }
      })
      .catch((err) => {
        res.status(200).json(err);
      });
  } else {
    res.status(200).json("you don't have the priveleges to remove the post");
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { desc, img } = req.body;
  let sameUser = false;

  await postModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
    }
  }).catch((err) => {
    res.status(400).json(err);
  });;

  const result = await roleModel.findById(req.token.role);
  if (result.role == "admin" || sameUser) {
    postModel
      .findByIdAndUpdate(id, { $set: { desc: desc, img: img } })
      .then((result) => {
        if (result) {
          res.status(200).json("post updated");
        } else {
          res.status(404).json("post does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("you don't have the priveleges to update the post");
  }
};

const giveLikeOrRemove = async (req, res) => {
  const { id } = req.params;
  likeModel
    .findOne({ user: req.token.id, post: id })
    .then((found) => {
      if (found) {
        
        likeModel
          .deleteOne({ user: req.token.id, post: id }, { like: !found.like })
          .then(() => {
            res.status(201).json("like removed");
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        
        const newLike = new likeModel({
          like: true,
          user: req.token.id,
          post: id,
        });
        newLike
        .save()
        .then((result) => {
          postModel
            .findByIdAndUpdate(id, { $push: { like: result._id } })
            .then((result) => {
              console.log(result);
            });
          res.status(201).json(result);
        })
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  giveLikeOrRemove,
  getPostsForAdmin
};