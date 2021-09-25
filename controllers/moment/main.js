const { Moment } = require("../../modals/Moment.js");

const getAllMoments = async (req, res, next) => {
  try {
    const allMoments = await Moment.find({});

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

module.exports = {
  getAllMoments,
  deleteAllMoments,
};
