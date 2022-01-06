const Cards = require("../../modals/Cards.js");
const Users = require("../../modals/User.js");
const Comment = require("../../modals/Comment.js");

const getCardById = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;

    const populateQuery = [
      {
        path: "host",
        select: ["name", "userName", "photoUrl", "fId", "userTag"],
      },
    ];

    const foundCard = await Cards.findById(cardId).populate(populateQuery);

    res.status(200).json(foundCard);
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

const deleteCardById = async (req, res, next) => {
  let commentIds = await Cards.findOne({ _id: req.params.cardId }).select(
    "comments"
  );
  await Comment.deleteMany({ _id: { $in: commentIds.comments } });
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

const getLikedUsersByCardId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const foundCard = await Cards.findById(cardId).populate({
      path: "likes",
      select: ["userName", "name", "fId", "photoUrl", "userTag"],
    });

    res.status(200).json(foundCard.likes);
  } catch (error) {
    next(error);
  }
};

const getSavedUsersByCardId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    const foundCard = await Cards.findById(cardId).populate({
      path: "saved",
      select: ["userName", "name", "fId", "photoUrl", "userTag"],
    });

    res.status(200).json(foundCard.saved);
  } catch (error) {
    next(error);
  }
};

const updateCardByCardId = async (req, res, next) => {
  try {
    let { cardId } = req.params;
    let { caption } = req.body;
    if (!cardId) throw new Error("Please pass card Id");

    let cardUpdated = await Cards.findOneAndUpdate(
      { _id: cardId },
      { caption }
    );

    if (!cardUpdated) throw new Error("card not found");
    cardUpdated && res.status(200).json(cardUpdated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCardById,
  patchCardById,
  putCardById,
  deleteCardById,
  getLikedUsersByCardId,
  getSavedUsersByCardId,
  updateCardByCardId,
};
