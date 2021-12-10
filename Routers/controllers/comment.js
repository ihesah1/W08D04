const commentModel = require("../../db/models/comment");
const roleModel = require("../../db/models/role");
const postModel = require("../../db/models/post");

const createComment = (req, res) => {
  const { id } = req.params;

  const { comment, isDeleted } = req.body;

  const newComment = new commentModel({
    comment,
    isDeleted,
    user: req.token.id,
    post: id,
  });
  newComment
    .save()
    .then((result) => {
      postModel
        .findByIdAndUpdate(id, { $push: { comment: result._id } })
        .then((result) => {
          console.log(result);
        });
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  let sameUser = false;

  await commentModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
    }
  });

  const result = await roleModel.findById(req.token.role);

  //here we check if it's Admin user OR the same user who created the comment
  if (result.role == "admin" || sameUser) {
    commentModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } })
      .then((result) => {
        if (result) {
          res.status(200).json("comment removed");
        } else {
          res.status(404).json("comment does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("you don't have the priveleges to remove the comment");
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  let sameUser = false;

  await commentModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
    }
  });

  //here we check if it's the same user who created the comment
  if (sameUser) {
    commentModel
      .findByIdAndUpdate(id, { $set: { comment: comment } })
      .then((result) => {
        if (result) {
          res.status(200).json("comment updated");
        } else {
          res.status(404).json("comment does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("you don't have the priveleges to update the comment");
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
