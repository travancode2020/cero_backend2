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

    if (!foundComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(foundComment);
  } catch (error) {
    next(error);
  }
};

const patchCommentByCommentId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const commentId = req.params.commentId;
    const updatedComment = req.body.comment;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(404).send("Card not found");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(404).send("Comment not found");
    }

    await Comment.findByIdAndUpdate(commentId, {
      $set: { comment: updatedComment },
    });

    res.status(200).json({ message: "Comment updated" });
  } catch (error) {
    next(error);
  }
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
  patchCommentByCommentId,
  deleteCommentByCommentId,
};
