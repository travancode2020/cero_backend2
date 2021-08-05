const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Cards = require("../modals/Cards");

const CardRouter = express.Router();

CardRouter.use(bodyParser.json());

CardRouter.route("/")
  .get((req, res, next) => {
    Cards.find({})
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

  .post((req, res, next) => {
    Cards.create(req.body)
      .then(
        (card) => {
          console.log("New Card Created", card);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Cards");
  })

  .delete((req, res, next) => {
    Cards.remove({})
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

CardRouter.route("/:cardId")

  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
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

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /CARDS/" + req.params.cardId);
  })

  .put((req, res, next) => {
    Cards.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: req.body,
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
    Cards.findByIdAndRemove(req.params.cardId)
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

module.exports = CardRouter;

/**CardRouter.route("/:cardId/likes")
  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.Likes);
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
            card.Likes.push(req.body);
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.Likes);
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
    res.end("PUT operation not supported on /Cards");
  });

CardRouter.route("/:cardId/likes/:likeid")
  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null && card.Likes.id(req.params.likeid) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.Likes.id(req.params.likeid));
          } else if (card == null) {
            err = new Error("Card " + req.params.cardId + " not found");
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
  })
  .delete((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null && card.Likes.id(req.params.likeid) != null) {
            card.Likes.id(req.params.likeid).remove();
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
            err = new Error("Comment " + req.params.likeid + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

CardRouter.route("/:cardId/dislikes")
  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.dislikes);
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
            card.dislikes.push(req.body);
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.dislikes);
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

CardRouter.route("/:cardId/dislikes/:dislikeid")
  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null && card.dislikes.id(req.params.dislikeid) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.dislikes.id(req.params.dislikeid));
          } else if (card == null) {
            err = new Error("Card " + req.params.cardId + " not found");
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
  })
  .delete((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null && card.dislikes.id(req.params.dislikeid) != null) {
            card.dislikes.id(req.params.dislikeid).remove();
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
            err = new Error("Comment " + req.params.likeid + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }); 
  
  
  
  CardRouter.route("/:cardId/link")
  .get((req, res, next) => {
    Cards.findById(req.params.cardId)
      .then(
        (card) => {
          if (card != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.link);
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
            card.link.push(req.body);
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.link);
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
    res.end("PUT operation not supported on /Cards");
  });

  
  
  
  
  
  
  
  */
