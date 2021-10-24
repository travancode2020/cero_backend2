const Cards = require("../../modals/Cards.js");

const getAllCommentsByCardId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;

    const userPopulateQuery = [
      { path: "comments", populate: { path: "user", select: ["userName"] } },
    ];
    const replyToPopulateQuery = [
      { path: "comments", populate: { path: "replyTo", select: ["userName"] } },
    ];

    const card = await Cards.findById(cardId)
      .select("comments")
      .populate(userPopulateQuery)
      .populate(replyToPopulateQuery);

    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

const postCommentByCardId = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then(
      (card) => {
        if (card != null) {
          card.comments.push(req.body);
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
