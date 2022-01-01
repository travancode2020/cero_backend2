const mongoose = require("mongoose");

const { Moment } = require("../../modals/Moment.js");
const Users = require("../../modals/User.js");

const getMomentsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const foundUser = await Users.findById({ _id: userId });

    const foundUserMoments = await Moment.find({
      host: foundUser._id,
    });

    const foundFollowingMoments = await Moment.aggregate([
      {
        $match: { host: { $in: foundUser.following } },
      },
      {
        $group: {
          _id: "$host",
          moments: { $addToSet: "$$ROOT" },
        },
      },
      {
        $unset: "moments.host",
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "host",
        },
      },
      {
        $unset: "_id",
      },
      { $unwind: "$host" },
      {
        $project: {
          "host._id": 1,
          "host.name": 1,
          "host.userName": 1,
          "host.photoUrl": 1,
          moments: 1,
        },
      },
    ]);

    res.status(200).json({
      hostMoments: foundUserMoments,
      followingMoments: foundFollowingMoments,
    });
  } catch (error) {
    next(error);
  }
};

const getMomentsOfUser = async (req, res, next) => {
  const userId = req.params.userId;

  const foundUser = await Users.findById({ _id: userId });
  res.status(200).json({ data: foundUser });
};

module.exports = {
  getMomentsByUserId,
  getMomentsOfUser,
};
