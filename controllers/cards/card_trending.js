const Cards = require("../../modals/Cards.js");

const getAllTrendingCards = async (req, res, next) => {
  try {
    const trendingCards = await Cards.aggregate([
      {
        $addFields: { likeCount: { $size: { $ifNull: ["$likes", []] } } },
      },
      {
        $lookup: {
          from: "users",
          let: { host: "$host" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$host"] } } },
            {
              $project: {
                name: 1,
                userName: 1,
                photoUrl: 1,
                fId: 1,
                userTag: 1,
              },
            },
          ],
          as: "host",
        },
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
