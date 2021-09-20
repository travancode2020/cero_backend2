const Cards = require("../../modals/Cards.js");

const getCardById = (req, res, next) => {
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
};

const patchCardById = (req, res, next) => {
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
};

const putCardById = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    {
      $pullAll: req.body,
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
};

const deleteCardById = (req, res, next) => {
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
};

module.exports = {
  getCardById,
  patchCardById,
  putCardById,
  deleteCardById,
};
