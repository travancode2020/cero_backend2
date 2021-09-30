const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const enableLocationSharing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const locationBody = req.body;

    const foundUser = await Users.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.isLocationSharingEnabled) {
      return res
        .status(400)
        .json({ message: "Location sharing is already enabled for this user" });
    }

    const createdLocation = await Location.create({
      ...locationBody,
      host: foundUser,
    });

    foundUser.isLocationSharingEnabled = true;
    foundUser.location = createdLocation;
    await foundUser.save();

    res.status(200).json({ message: "Location Sharing enabled" });
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const locationBody = req.body;

    const foundLocation = await Users.findById(userId).select("location");
    const updatedLocation = await Location.findByIdAndUpdate(
      foundLocation.location,
      { ...locationBody },
      { new: true }
    );

    res.status(200).json(updatedLocation);
  } catch (error) {
    next(error);
  }
};

const disableLocationSharing = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const foundUser = await Users.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Location.findByIdAndRemove(foundUser.location);

    foundUser.isLocationSharingEnabled = false;
    foundUser.location = null;
    await foundUser.save();

    res.status(200).json({ message: "Location Sharing disabled" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enableLocationSharing,
  updateLocation,
  disableLocationSharing,
};
