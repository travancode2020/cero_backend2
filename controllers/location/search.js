const Location = require("../../modals/Location.js");
const Users = require("../../modals/User.js");

const searchByCity = async (req, res, next) => {
  try {
    const tag = req.query.tag;
    const city = req.query.city;
    const pro = req.query.pro == "true" ? true : false;
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

    if (pro) {
      let users = await Location.aggregate([
        { $match: { city: city } },
        {
          $lookup: {
            from: "users",
            localField: "host",
            foreignField: "_id",
            as: "host",
          },
        },
        { $unwind: "$host" },
        {
          $match: {
            "host.isPro": pro,
            "host.userTag": {
              $regex: `^${tag}`,
              $options: "i",
            },
          },
        },
        {
          $project: {
            "host.following": 0,
            "host.saved": 0,
            "host.liked": 0,
            "host.viewed": 0,
            "host.isLocationSharingEnabled": 0,
            "host.fId": 0,
            "host.email": 0,
            "host.password": 0,
            "host.dob": 0,
            "host.work": 0,
            "host.location": 0,
            "host.agoraId": 0,
            "host.createdAt": 0,
            "host.updatedAt": 0,
            "host.createdAt": 0,
            "host.proBio": 0,
            "host.phone": 0,
          },
        },
      ]);

      users = users.filter((user) => user.host);
      let data = users.slice(skip, skip + limit);
      let totalPages = Math.ceil(users.length / limit);
      res.status(200).json({ totalPages, data: data });
    } else {
      let users = await Location.aggregate([
        { $match: { city: city } },
        {
          $lookup: {
            from: "users",
            localField: "host",
            foreignField: "_id",
            as: "host",
          },
        },
        { $unwind: "$host" },
        {
          $match: {
            "host.isPro": pro,
            "host.userTag": {
              $regex: `^${tag}`,
              $options: "i",
            },
          },
        },
        {
          $project: {
            "host.following": 0,
            "host.saved": 0,
            "host.liked": 0,
            "host.viewed": 0,
            "host.isLocationSharingEnabled": 0,
            "host.fId": 0,
            "host.email": 0,
            "host.password": 0,
            "host.dob": 0,
            "host.work": 0,
            "host.location": 0,
            "host.agoraId": 0,
            "host.createdAt": 0,
            "host.updatedAt": 0,
            "host.createdAt": 0,
            "host.proBio": 0,
            "host.phone": 0,
          },
        },
      ]);
      users = users.filter((user) => user.host);
      let data = users.slice(skip, skip + limit);
      let totalPages = Math.ceil(users.length / limit);
      res.status(200).json({ totalPages, data: data });
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
    const pro = req.query.pro == "true" ? true : false;
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
      let users = await Location.aggregate([
        {
          $match: {
            location: {
              $geoWithin: {
                $centerSphere: [
                  [Number(lat), Number(lng)],
                  Number(range) / 6378000.16,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "host",
            foreignField: "_id",
            as: "host",
          },
        },
        { $unwind: "$host" },
        {
          $match: {
            "host.isPro": Boolean(pro),
            "host.userTag": {
              $regex: `^${tag}`,
              $options: "i",
            },
          },
        },
        {
          $project: {
            "host.following": 0,
            "host.saved": 0,
            "host.liked": 0,
            "host.viewed": 0,
            "host.isLocationSharingEnabled": 0,
            "host.fId": 0,
            "host.email": 0,
            "host.password": 0,
            "host.dob": 0,
            "host.work": 0,
            "host.location": 0,
            "host.agoraId": 0,
            "host.createdAt": 0,
            "host.updatedAt": 0,
            "host.createdAt": 0,
            "host.proBio": 0,
            "host.phone": 0,
          },
        },
      ]);
      users = users.filter((user) => user.host);
      let data = users.slice(skip, skip + limit);
      let totalPages = Math.ceil(users.length / limit);
      res.status(200).json({ totalPages, data: data });
    } else {
      let users = await Location.aggregate([
        {
          $match: {
            location: {
              $geoWithin: {
                $centerSphere: [
                  [Number(lat), Number(lng)],
                  Number(range) / 6378000.16,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "host",
            foreignField: "_id",
            as: "host",
          },
        },
        { $unwind: "$host" },
        {
          $match: {
            "host.isPro": pro,
            "host.userTag": {
              $regex: `^${tag}`,
              $options: "i",
            },
          },
        },
        {
          $project: {
            "host.following": 0,
            "host.saved": 0,
            "host.liked": 0,
            "host.viewed": 0,
            "host.isLocationSharingEnabled": 0,
            "host.fId": 0,
            "host.email": 0,
            "host.password": 0,
            "host.dob": 0,
            "host.work": 0,
            "host.location": 0,
            "host.agoraId": 0,
            "host.createdAt": 0,
            "host.updatedAt": 0,
            "host.createdAt": 0,
            "host.proBio": 0,
            "host.phone": 0,
          },
        },
      ]);
      users = users.filter((user) => user.host);
      let data = users.slice(skip, skip + limit);
      let totalPages = Math.ceil(users.length / limit);
      res.status(200).json({ totalPages, data: data });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchByCity,
  searchByRange,
};
