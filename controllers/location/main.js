const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const getAllLocations = async (req, res, next) => {
  try {
    const city = req.query.city;
    var foundLocations = null;

    const populatePath = "host";
    const populateSelect =
      "-following -saved -liked -viewed -isLocationSharingEnabled -fId -email -password -dob -work  -location";

    if (city) {
      foundLocations = await Location.find({ city: city }).populate(populatePath,populateSelect);
    } else {
      foundLocations = await Location.find({}).populate(populatePath,populateSelect);
    }
    res.status(200).json(foundLocations);
  } catch (error) {
    next(error);
  }
};

const deleteAllLocations = async (req, res, next) => {
  try {
    await Users.updateMany(
      {},
      { isLocationSharingEnabled: false, location: null }
    );
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
