const Cards = require("../../modals/Cards.js");

const getAllCards = async (req, res, next) => {
  try {
    const interestString = req.query.interests || "";
    const interestArray = interestString.split(",");

    console.log(interestString)

    let foundCards = null;

    if (interestString.length) {
      foundCards = await Cards.find({ tags: { $in: interestArray } });
    } else {
      foundCards = await Cards.find({});
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
