const Cards = require("../../modals/Cards.js");
const Comment = require("../../modals/Comment.js");

const mongoose = require("mongoose");

const getCommentByCommentId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(404).send("Card not found");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(404).send("Comment not found");
    }

    const foundComment = await Comment.findById(commentId);
    res.status(200).json(foundComment);
  } catch (error) {
    next(error);
  }
};

const putCommentByCommentId = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId)

    .then(
      (card) => {
        if (card != null && card.comments.id(req.params.commentId) != null) {
          if (req.body.comment) {
            card.comments.id(req.params.commentId).comment = req.body.comment;
          }
          if (req.body.likes) {
            card.comments.id(req.params.commentId).likes = req.body.likes;
          }
          if (req.body.userId) {
            card.comments.id(req.params.commentId).userId = req.body.userId;
          }
          if (req.body.userName) {
            card.comments.id(req.params.commentId).userName = req.body.userName;
          }
          if (req.body.replyTo) {
            card.comments.id(req.params.commentId).replyTo = req.body.replyTo;
          }

          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.comments.id(req.params.commentId));
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("Card " + req.params.cardId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.commentId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteCommentByCommentId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(404).send("Card not found");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(404).send("Comment not found");
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentByCommentId,
  putCommentByCommentId,
  deleteCommentByCommentId,
};
