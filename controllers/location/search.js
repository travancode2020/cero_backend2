const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const locationBasedSearch = async (req, res, next) => {
  try {
    const range = req.query.range;
    const tag = req.query.tag;
    const lat = req.query.lat;
    const lng = req.query.lng;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Coordinates are required for search" });
    }

    if (!range) {
      return res.status(400).json({ message: "Range is required" });
    }

    await Location.ensureIndexes({ point: "2dsphere" });

    if (tag) {
      await Location.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: range,
          },
        },
      })
        .populate("host", null, { userTag: tag })
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          res.status(200).json(users);
        });
    } else {
      await Location.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: range,
          },
        },
      })
        .populate("host")
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          res.status(200).json(users);
        });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  locationBasedSearch,
};
