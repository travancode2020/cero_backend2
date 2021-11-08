const { Moment } = require("../../modals/Moment.js");

const getAllMoments = async (req, res, next) => {
  try {
    const userPopulateQuery = [
      {
        path: "views",
        select: ["userName", "fId", "name", "photoUrl", "userTag"],
      },
    ];
    const allMoments = await Moment.find({}).populate(userPopulateQuery);

    res.status(200).json(allMoments);
  } catch (error) {
    next(error);
  }
};

const deleteAllMoments = async (req, res, next) => {
  try {
    await Moment.remove({}).then((response) => res.status(200).json(response));
  } catch (error) {
    next(error);
  }
};

const createMoment = async (req, res, next) => {
  try {
    const momentBody = req.body;
    const newMoment = await Moment.create(momentBody);

    res.status(200).json(newMoment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMoments,
  deleteAllMoments,
  createMoment,
};
