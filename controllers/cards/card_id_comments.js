const Cards = require("../../modals/Cards.js");

const getAllCommentsByCardId = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then(
      (card) => {
        if (card != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.comments);
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
