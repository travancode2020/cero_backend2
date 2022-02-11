const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const searchByCity = async (req, res, next) => {
  try {
    const tag = req.query.tag;
    const city = req.query.city;
    const pro = req.query.pro;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    await Location.ensureIndexes({ point: "2dsphere" });

    const populatePath = "host";
    const populateSelect =
      "-following -saved -liked -viewed -isLocationSharingEnabled -fId -email -password -dob -work  -location -agoraId -createdAt -updatedAt -createdAt -proBio -phone";

    if (pro) {
      await Location.find({ city: city })
        .populate(populatePath, populateSelect, { isPro: pro, userTag: tag })
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          let data = users.slice(skip, skip + limit);
          let totalPages = Math.ceil(users.length / limit);
          res.status(200).json({ totalPages, data: data });
        });
    } else {
      await Location.find({ city: city })
        .populate(populatePath, populateSelect, { userTag: tag })
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          let data = users.slice(skip, skip + limit);
          let totalPages = Math.ceil(users.length / limit);
          res.status(200).json({ totalPages, data: data });
        });
    }
  } catch (error) {
    next(error);
  }
};

const searchByRange = async (req, res, next) => {
  try {
    const range = req.query.range;
    const lat = req.query.lat;
    const lng = req.query.lng;
    const tag = req.query.tag;
    const pro = req.query.pro;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Coordinates are required for search" });
    }

    if (!range) {
      return res.status(400).json({ message: "Range is required" });
    }

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    await Location.ensureIndexes({ point: "2dsphere" });

    const populatePath = "host";
    const populateSelect =
      "-following -saved -liked -viewed -isLocationSharingEnabled -fId -email -password -dob -work  -location   -agoraId -createdAt -updatedAt -createdAt -proBio -phone ";

    if (pro) {
      await Location.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: range,
          },
        },
      })
        .populate(populatePath, populateSelect, { userTag: tag, isPro: pro })
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          let data = users.slice(skip, skip + limit);
          let totalPages = Math.ceil(users.length / limit);
          res.status(200).json({ totalPages, data: data });
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
        .populate(populatePath, populateSelect, { userTag: tag })
        .exec((err, users) => {
          if (err) {
            next(err);
          }
          users = users.filter((user) => user.host);
          let data = users.slice(skip, skip + limit);
          let totalPages = Math.ceil(users.length / limit);
          res.status(200).json({ totalPages, data: data });
        });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchByCity,
  searchByRange,
};
