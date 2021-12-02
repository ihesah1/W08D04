const commentModel = require("../../db/models/comment");
const roleModel = require("../../db/models/role");
const createComment = (req, res) => {
  const { id } = req.params;
  const { comment , isDeleted } = req.body;
  const newComment = new commentModel({ comment, isDeleted, user: req.token.id, post:id });
  newComment
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
////delete comments 
const deleteComment = async (req, res) => {
  const { id } = req.params;
  let sameUser = false;

  await commentModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
  }});
  const result = await roleModel.findById(req.token.role);
  if (result.role == "admin" || sameUser) {
    commentModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } })
      .then((result) => {
        if (result) {
          res.status(200).json("comment removed");
        } else {
          res.status(404).json("the comment is not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json("you don't have the priveleges to remove the comment");
}};
/////update user comment 
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  let sameUser = false;

  await commentModel.findOne({ _id: id, user: req.token.id }).then((result) => {
    if (result) {
      sameUser = true;
  }});
///check
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
    res.status(400).json("you cant update the comment");
  }};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};