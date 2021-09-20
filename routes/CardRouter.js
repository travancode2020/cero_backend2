const express = require("express");

// Import controllers
const {
  getAllCards,
  createCard,
  deleteAllCards,
} = require("../controllers/cards/main.js");

const {
  getCardById,
  patchCardById,
  putCardById,
  deleteCardById,
} = require("../controllers/cards/card_id.js");

const {
  getAllCommentsByCardId,
  postCommentByCardId,
  deleteAllCommentsByCardId,
} = require("../controllers/cards/card_id_comments.js");

const {
  getCommentByCommentId,
  putCommentByCommentId,
  deleteCommentByCommentId,
} = require("../controllers/cards/card_id_comment_id.js");

const {
  getAllTrendingCards,
} = require("../controllers/cards/card_trending.js");

const CardRouter = express.Router();

// controllers/cards/main.js
CardRouter.get("/", getAllCards);
CardRouter.post("/", createCard);
CardRouter.put("/", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /Cards");
});
CardRouter.delete("/", deleteAllCards);

//controllers/cards/card_trending.js
CardRouter.get("/trending", getAllTrendingCards);

// controllers/cards/card_id.js
CardRouter.get("/:cardId", getCardById);
CardRouter.post("/:cardId", (req, res) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /CARDS/" + req.params.cardId);
});
CardRouter.patch("/:cardId", patchCardById);
CardRouter.put("/:cardId", putCardById);
CardRouter.delete("/:cardId", deleteCardById);

// controllers/cards/card_id_comments.js
CardRouter.get("/:cardId/comments", getAllCommentsByCardId);
CardRouter.post("/:cardId/comments", postCommentByCardId);
CardRouter.put("/:cardId/comments", (req, res) => {
  res.statusCode = 403;
  res.end(
    "PUT operation not supported on /Cards/" + req.params.cardId + "/comments"
  );
});
CardRouter.delete("/:cardId/comments", deleteAllCommentsByCardId);

// controllers/cards/card_id_comment_id.js
CardRouter.get("/:cardId/comments/:commentId", getCommentByCommentId);
CardRouter.post("/:cardId/comments/:commentId", (req, res) => {
  res.statusCode = 403;
  res.end(
    "POST operation not supported on /Cards/" +
      req.params.cardId +
      "/comments/" +
      req.params.commentId
  );
});
CardRouter.put("/:cardId/comments/:commentId", putCommentByCommentId);
CardRouter.delete("/:cardId/comments/:commentId", deleteCommentByCommentId);

module.exports = CardRouter;

/*

CardRouter.route("/").get((req, res, next) => {
 
  const tag = req.body.tags;

  Cards.find({ tags: tag  })
    .then(
      (card) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(card);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
*/

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
