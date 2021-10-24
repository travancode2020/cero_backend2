const Cards = require("../../modals/Cards.js");
const Users = require("../../modals/User.js");

const getCardById = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;

    const foundCard = await Cards.findById(cardId);
    const foundHost = await Users.findById(foundCard.hostId).select(
      "userTag userName name photoUrl"
    );

    foundCard.commentCount = foundCard.comments.length;
    foundCard.comments = undefined;

    res.status(200).json({ ...foundCard._doc, host: foundHost });
  } catch (error) {
    next(error);
  }
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
