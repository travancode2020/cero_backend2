const Cards = require("../../modals/Cards.js");
const User = require("../../modals/User.js");
const mongoose = require("mongoose");

const getCardsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const populateQuery = [
      {
        path: "host",
        select: ["name", "userName", "photoUrl", "fId", "userTag"],
      },
    ];

    const foundCards = await Cards.find({ host: userId }).populate(
      populateQuery
    );

    if (!foundCards) {
      return res.status(404).json({ message: "Cards not found" });
    }

    res.status(200).json(foundCards);
  } catch (error) {
    next(error);
  }
};

const getSavedCardsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const userPopulateQuery = [
      {
        path: "saved",
        populate: {
          path: "host",
          select: ["userName", "fId", "name", "photoUrl", "userTag"],
        },
      },
    ];

    const foundUser = await User.findById(userId).populate(userPopulateQuery);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser.saved);
  } catch (error) {
    next(error);
  }
};

const saveCardByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cardId = req.params.cardId;
    const isSaved =
      req.body.isSaved === "true"
        ? true
        : req.body.isSaved === "false"
        ? false
        : null;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).send("User not found");
    }

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(404).send("Card not found");
    }

    if (isSaved === null || isSaved === undefined) {
      return res.status(400).json({ message: "isSaved is required" });
    }

    if (isSaved) {
      await Cards.findByIdAndUpdate(cardId, {
        $addToSet: { saved: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { saved: cardId },
      });
    } else {
      await Cards.findByIdAndUpdate(cardId, {
        $pull: { saved: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { saved: cardId },
      });
    }

    res.status(200).json({ message: "Card updated" });
  } catch (error) {
    next(error);
  }
};

const likeCardByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const cardId = req.params.cardId;
  const isLiked =
    req.body.isLiked === "true"
      ? true
      : req.body.isLiked === "false"
      ? false
      : null;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("User not found");
  }

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(404).send("Card not found");
  }

  if (isLiked === null || isLiked === undefined) {
    return res.status(400).json({ message: "isLiked is required" });
  }

  if (isLiked) {
    await Cards.findByIdAndUpdate(cardId, {
      $addToSet: { likes: userId },
      $pull: { disLikes: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { liked: cardId },
    });
  } else {
    await Cards.findByIdAndUpdate(cardId, {
      $pull: { likes: userId, disLikes: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { liked: cardId },
    });
  }

  res.status(200).json({ message: "Card updated" });
  try {
  } catch (error) {
    next(error);
  }
};

const dislikeCardByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const cardId = req.params.cardId;
  const isDisliked =
    req.body.isDisliked === "true"
      ? true
      : req.body.isDisliked === "false"
      ? false
      : null;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("User not found");
  }

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(404).send("Card not found");
  }

  if (isDisliked === null || isDisliked === undefined) {
    return res.status(400).json({ message: "isDisliked is required" });
  }

  if (isDisliked) {
    await Cards.findByIdAndUpdate(cardId, {
      $addToSet: { disLikes: userId },
      $pull: { likes: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { liked: cardId },
    });
  } else {
    await Cards.findByIdAndUpdate(cardId, {
      $pull: { likes: userId, disLikes: userId },
    });
  }

  res.status(200).json({ message: "Card updated" });
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCardsByUserId,
  saveCardByUserId,
  getSavedCardsByUserId,
  likeCardByUserId,
  dislikeCardByUserId,
};
