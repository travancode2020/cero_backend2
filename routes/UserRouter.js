const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Users = require("../modals/User");

const UserRouter = express.Router();

UserRouter.use(bodyParser.json());

UserRouter.route("/")

  .get((req, res, next) => {
    Users.find({})
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Users.create(req.body)
      .then(
        (user) => {
          console.log("New User Created", user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Users");
  })

  .delete((req, res, next) => {
    Users.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

UserRouter.route("/:user_id").get((req, res, next) => {
  Users.findById(req.params.user_id)
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
/*
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /CARDS/" + req.params.cardId);
  })

  .put((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.user_id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (card) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });



CardRouter.route("/:cardId/comments")
  .get((req, res, next) => {
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
  })
  .post((req, res, next) => {
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
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /Cards/" + req.params.cardId + "/comments"
    );
  })
  .delete((req, res, next) => {
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
  });

CardRouter.route("/:cardId/comments/:commentId")
  .get((req, res, next) => {
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
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /Cards/" +
        req.params.cardId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null && card.comments.id(req.params.commentId) != null) {
            if (req.body.comment) {
              card.comments.id(req.params.commentId).comment = req.body.comment;
            }
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card);
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
  })
  .delete((req, res, next) => {
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
  });
*/
module.exports = UserRouter;
