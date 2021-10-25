const Cards = require("../../modals/Cards.js");

const getAllTrendingCards = async (req, res, next) => {
  try {
    const trendingCards = await Cards.aggregate([
      {
        $addFields: { likeCount: { $size: { $ifNull: ["$likes", []] } } },
      },
      {
        $group: {
          _id: { $first: "$tags" },
          cards: { $addToSet: "$$ROOT" },
        },
      },
      {
        $unwind: "$cards",
      },
      {
        $sort: { _id: 1, "cards.likeCount": -1 },
      },
      {
        $group: {
          _id: "$_id",
          cards: { $push: "$cards" },
        },
      },
    ]);

    res.status(200).json(trendingCards);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrendingCards,
};
