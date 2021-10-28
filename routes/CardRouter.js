const express = require("express");

// Import controllers
const {
  getAllCards,
  createCard,
  deleteAllCards,
} = require("../controllers/cards/main.js");

const {
  getCardsByUserId,
  saveCardByUserId,
  getSavedCardsByUserId,
  likeCardByUserId,
} = require("../controllers/cards/card_user_id.js");

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
  patchCommentByCommentId,
  deleteCommentByCommentId,
  likeCommentByCommentId,
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

//controllers/cards/card_user_id.js
CardRouter.get("/user/:userId", getCardsByUserId);
CardRouter.post("/user/:userId/save/:cardId", saveCardByUserId);
CardRouter.get("/user/:userId/saved", getSavedCardsByUserId);
CardRouter.post("/like/:cardId/user/:userId", likeCardByUserId);

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
CardRouter.patch("/:cardId/comments/:commentId", patchCommentByCommentId);
CardRouter.delete("/:cardId/comments/:commentId", deleteCommentByCommentId);

CardRouter.post("/:userId/comments/like/:commentId", likeCommentByCommentId);
module.exports = CardRouter;
