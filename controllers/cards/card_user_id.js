const Cards = require("../../modals/Cards.js");
const User = require("../../modals/User.js");
const mongoose = require("mongoose");
const { sendFirebaseNotification } = require("../fireBaseNotification/main");

const getCardsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    const populateQuery = [
      {
        path: "host",
        select: ["name", "userName", "photoUrl", "fId", "userTag"],
      },
    ];

    const foundCards = await Cards.find({ host: userId })
      .populate(populateQuery)
      .limit(limit)
      .skip(skip);
    const count = await Cards.find({ host: userId }).populate(populateQuery);
    let totalPages = Math.ceil(count.length / limit);

    if (!foundCards) {
      return res.status(404).json({ message: "Cards not found" });
    }

    res.status(200).json({ totalPages, data: foundCards });
  } catch (error) {
    next(error);
  }
};

const getSavedCardsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

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
    let savedCards = foundUser.saved.slice(skip, skip + limit);
    let totalPages = Math.ceil(foundUser.saved.length / limit);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ totalPages, data: savedCards });
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
  const notificationToken = req.body;
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
    let likeUserData = await User.findByIdAndUpdate(userId, {
      $addToSet: { liked: cardId },
    });
    await sendFirebaseNotification(
      "cero",
      `${likeUserData.userName} liked your cards.`,
      notificationToken
    );
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

const getLikedCardsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    const userPopulateQuery = [
      {
        path: "liked",
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
    let likedUsers = foundUser.liked.slice(skip, skip + limit);
    let totalPages = Math.ceil(foundUser.liked.length / limit);

    res.status(200).json({ totalPages, data: likedUsers });
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
  getLikedCardsByUserId,
};
