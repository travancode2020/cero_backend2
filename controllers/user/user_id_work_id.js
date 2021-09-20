const Users = require("../../modals/User.js");

const getWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.work.id(req.params.workId));
        } else if (card == null) {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.workId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const putWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          if (req.body.images) {
            card.work.id(req.params.workId).images = req.body.images;
          }
          if (req.body.views) {
            card.work.id(req.params.workId).views = req.body.views;
          }

          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.work);
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

const patchWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          if (req.body.images) {
            card.work.id(req.params.workId).images = req.body.images;
          }
          if (req.body.views) {
            card.work.id(req.params.workId).views = req.body.views;
          }

          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.work);
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

const deleteWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          card.work.id(req.params.workId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.work);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.cardId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.likeid + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getWorkByWorkId,
  putWorkByWorkId,
  patchWorkByWorkId,
  deleteWorkByWorkId,
};
