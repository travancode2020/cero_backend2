const Cards = require("../../modals/Cards.js");

const getAllCards = async (req, res, next) => {
  try {
    const interestString = req.query.interests || "";
    const interestArray = interestString.split(",");

    const count = parseInt(req.query.count);
    const page = parseInt(req.query.page);

    let foundCards = null;

    if (interestString.length) {
      foundCards = await Cards.find({ tags: { $in: interestArray } })
        .skip(count * (page - 1))
        .limit(count);
    } else {
      foundCards = await Cards.find({})
        .skip(count * (page - 1))
        .limit(count);
    }

    res.status(200).json(foundCards);
  } catch (error) {
    next(error);
  }
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

const deleteAllCards = (req, res, next) => {
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
  deleteAllCards,
};