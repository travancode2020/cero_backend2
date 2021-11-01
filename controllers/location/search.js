const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const locationBasedSearch = async (req, res, next) => {
  try {
    const range = req.query.range;
    const lat = req.query.lat;
    const lng = req.query.lng;
    const tag = req.query.tag;
    const pro = req.query.pro;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Coordinates are required for search" });
    }

    if (!range) {
      return res.status(400).json({ message: "Range is required" });
    }

    await Location.ensureIndexes({ point: "2dsphere" });

    const populatePath = "host";
    const populateSelect =
      "-following -saved -liked -viewed -isLocationSharingEnabled -fId -email -password -dob -work  -location";

    if (tag && pro) {
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
          res.status(200).json(users);
        });
    } else if (tag && !pro) {
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
          res.status(200).json(users);
        });
    } else if (!tag && pro) {
      await Location.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: range,
          },
        },
      })
        .populate(populatePath, populateSelect, { isPro: pro })
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
        .populate(populatePath, populateSelect)
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

// const locationBasedSearch = async (req, res, next) => {
//   try {
//     const range = req.query.range;
//     const tag = req.query.tag;
//     const lat = req.query.lat;
//     const lng = req.query.lng;
//     const pro = req.query.pro;

//     if (!lat || !lng) {
//       return res
//         .status(400)
//         .json({ message: "Coordinates are required for search" });
//     }

//     if (!range) {
//       return res.status(400).json({ message: "Range is required" });
//     }

//     await Location.ensureIndexes({ point: "2dsphere" });

//     if (tag && pro) {
//       await Location.find({
//         location: {
//           $near: {
//             $geometry: { type: "Point", coordinates: [lng, lat] },
//             $maxDistance: range,
//           },
//         },
//       })
//         .populate(
//           "host",
//           "-following -saved -liked -viewed -isLocationSharingEnabled -fId -email -password -dob -work  -location",
//           { userTag: tag, isPro: pro }
//         )
//         .exec((err, users) => {
//           if (err) {
//             next(err);
//           }
//           users = users.filter((user) => user.host);
//           res.status(200).json(users);
//         });
//     } else {
//       await Location.find({
//         location: {
//           $near: {
//             $geometry: { type: "Point", coordinates: [lng, lat] },
//             $maxDistance: range,
//           },
//         },
//       })
//         .populate("host", null, { isPro: pro })
//         .exec((err, users) => {
//           if (err) {
//             next(err);
//           }
//           users = users.filter((user) => user.host);
//           res.status(200).json(users);
//         });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  locationBasedSearch,
};
