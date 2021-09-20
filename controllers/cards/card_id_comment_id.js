const Cards = require("../../modals/Cards.js");

const getCommentByCommentId = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then(
      (card) => {
        if (card != null && card.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.comments.id(req.params.commentId));
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

const putCommentByCommentId = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId)

    .then(
      (card) => {
        console.log(card.comments.id(req.params.commentId));
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

const deleteCommentByCommentId = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then(
      (card) => {
        if (card != null && card.comments.id(req.params.commentId) != null) {
          card.comments.id(req.params.commentId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.cardId + " not found");
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

module.exports = {
  getCommentByCommentId,
  putCommentByCommentId,
  deleteCommentByCommentId,
};
