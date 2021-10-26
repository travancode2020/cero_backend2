const Cards = require("../../modals/Cards.js");
const Comment = require("../../modals/Comment.js");
const mongoose = require("mongoose");

const getAllCommentsByCardId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;

    const userPopulateQuery = [
      {
        path: "comments",
        populate: { path: "user", select: ["userName", "fId"] },
      },
    ];
    const replyToPopulateQuery = [
      {
        path: "comments",
        populate: { path: "replyTo", select: ["userName", "fId"] },
      },
    ];

    const card = await Cards.findById(cardId)
      .select("comments")
      .populate(userPopulateQuery)
      .populate(replyToPopulateQuery);

    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }

    res.status(200).json(card.comments);
  } catch (error) {
    next(error);
  }
};

const postCommentByCardId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const commentBody = req.body;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(404).send("Card not found");
    }

    const newComment = await Comment.create(commentBody);
    const updatedCard = await Cards.findByIdAndUpdate(
      cardId,
      {
        $push: { comments: newComment._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const deleteAllCommentsByCardId = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then(
      (card) => {
        if (card != null) {
          for (var i = card.comments.length - 1; i >= 0; i--) {
            card.comments.id(card.comments[i]._id).remove();
          }
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card);
            },
            (err) => next(err)
          );
        } else {
          err = new Error("Card " + req.params.cardId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getAllCommentsByCardId,
  postCommentByCardId,
  deleteAllCommentsByCardId,
};
