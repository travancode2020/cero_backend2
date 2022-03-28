const Cards = require("../../modals/Cards.js");
const moment = require("moment");

const getAllTrendingCards = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    let todayDate = new Date();

    let trendingCards = await Cards.aggregate([
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likes", []] } },
          treandingRation: {
            $divide: [
              { $size: { $ifNull: ["$likes", []] } },
              {
                $divide: [
                  { $subtract: [todayDate, "$createdAt"] },
                  1000 * 60 * 60 * 24,
                ],
              },
            ],
          },
        },
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
        $unwind: "$host",
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
        $sort: { _id: 1, "cards.treandingRation": -1 },
      },
      {
        $group: {
          _id: "$_id",
          cards: { $push: "$cards" },
        },
      },
    ]);
    trendingCards.forEach((obj, index) => {
      obj.cards = obj.cards.slice(0, 3);
    });

    res.status(200).json(trendingCards);
  } catch (error) {
    next(error);
  }
};

const getAllTrendingCardsByInterests = async (req, res, next) => {
  try {
    let { page, limit, interests } = req.query;
    const interestString = interests || "";
    const interestArray = interestString.split(",");
    let todayDate = new Date();

    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    let totalPages;

    if (interestArray[0] === "") {
      return res.status(400).json({ message: "interests are missing" });
    }

    const trendingCards = await Cards.aggregate([
      { $match: { tags: { $in: interestArray } } },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likes", []] } },
          treandingRation: {
            $divide: [
              { $size: { $ifNull: ["$likes", []] } },
              {
                $divide: [
                  { $subtract: [todayDate, "$createdAt"] },
                  1000 * 60 * 60 * 24,
                ],
              },
            ],
          },
          id: "$_id",
        },
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
                userTag: 1,
                fId: 1,
              },
            },
          ],
          as: "host",
        },
      },
      {
        $unwind: "$host",
      },
      {
        $sort: { _id: 1, "cards.treandingRation": -1 },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalData = await Cards.aggregate([
      { $match: { tags: { $in: interestArray } } },
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
        $unwind: "$host",
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
          card: { $push: "$cards" },
        },
      },
      {
        $unwind: "$card",
      },
    ]);
    totalPages = Math.ceil(totalData.length / limit);

    res.status(200).json({ totalPages, data: trendingCards });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrendingCards,
  getAllTrendingCardsByInterests,
};
