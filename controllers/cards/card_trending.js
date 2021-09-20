const Cards = require("../../modals/Cards.js");

const getAllTrendingCards = async (req, res, next) => {
  try {
    const trendingCards = await Cards.aggregate([
      {
        $addFields: { like_count: { $size: { $ifNull: ["$likes", []] } } },
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
        $sort: { "cards.like_count": 1 },
      },
      {
        $group: {
          _id: "$_id",
          cards: { $addToSet: "$$ROOT.cards" },
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
