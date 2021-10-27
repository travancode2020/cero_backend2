const Cards = require("../../modals/Cards.js");

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

module.exports = {
  getCardsByUserId,
};
