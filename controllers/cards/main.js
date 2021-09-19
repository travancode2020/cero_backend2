const Cards = require("../../modals/Cards.js");

const getAllCards = (req, res, next) => {
  Cards.find({})
    .then(
      (card) => {
        res.status(200).json(card);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
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
};

const deleteCard = (req, res, next) => {
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
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
};
