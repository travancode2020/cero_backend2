const Location = require("../../modals/Location.js");

const getAllLocations = async (req, res, next) => {
  try {
    const foundLocations = await Location.find({});
    res.status(200).json(foundLocations);
  } catch (error) {
    next(error);
  }
};

const deleteAllLocations = async (req, res, next) => {
  try {
    await Location.remove({}).then((response) =>
      res.status(200).json(response)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  deleteAllLocations,
};
