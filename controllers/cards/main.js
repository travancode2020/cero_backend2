const Cards = require("../../modals/Cards.js");

const getAllCards = async (req, res, next) => {
  try {
    const interestString = req.query.interests || "";
    const interestArray = interestString.split(",");
    const userId = req.query.userId;

    const count = parseInt(req.query.count) || 5;
    const page = parseInt(req.query.page);

    let foundCards = null;
    const populateQuery = [
      {
        path: "host",
        select: ["name", "userName", "photoUrl", "fId", "userTag"],
      },
    ];
    let total;
    if (interestString.length) {
      if (userId) {
        foundCards = await Cards.find({
          tags: { $in: interestArray },
          likes: { $nin: [userId] },
          disLikes: { $nin: [userId] },
        })
          .populate(populateQuery)
          .skip(count * (page - 1))
          .limit(count);
        total = await Cards.find({
          tags: { $in: interestArray },
          likes: { $nin: [userId] },
          disLikes: { $nin: [userId] },
        }).populate(populateQuery);
      } else {
        foundCards = await Cards.find({ tags: { $in: interestArray } })
          .populate(populateQuery)
          .skip(count * (page - 1))
          .limit(count);

        total = await Cards.find({ tags: { $in: interestArray } }).populate(
          populateQuery
        );
      }
    } else {
      if (userId) {
        foundCards = await Cards.find({
          likes: { $nin: [userId] },
          disLikes: { $nin: [userId] },
        })
          .populate(populateQuery)
          .skip(count * (page - 1))
          .limit(count);
        total = await Cards.find({
          likes: { $nin: [userId] },
          disLikes: { $nin: [userId] },
        });
      } else {
        foundCards = await Cards.find({})
          .populate(populateQuery)
          .skip(count * (page - 1))
          .limit(count);

        total = await Cards.find({}).populate(populateQuery);
      }
    }
    let totalPages = Math.ceil(total.length / count);
    res.status(200).json({ totalPages, data: foundCards });
  } catch (error) {
    next(error);
  }
};

const createCard = (req, res, next) => {
  Cards.create(req.body)
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
