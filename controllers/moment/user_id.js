const mongoose = require("mongoose");

const { Moment } = require("../../modals/Moment.js");
const Users = require("../../modals/User.js");

const getMomentsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const foundUser = await Users.findById({ _id: userId });

    const foundUserMoments = await Moment.find({
      host: foundUser._id,
    }).sort({ createdAt: -1 });
    let foundFollowingMoments = await Moment.aggregate([
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
    // foundFollowingMoments = foundFollowingMoments.map((followingObj) => {
    let mainindex = 0;
    for (let followingObj of foundFollowingMoments) {
      let arr = [];
      let index = 0;

      // followingObj.moments.map((momentObj, index) => {
      for (let momentObj of foundFollowingMoments) {
        if (index == 0) {
          arr.push(momentObj);
        } else {
          for (let a = 0; a < arr.length; a++) {
            if (momentObj.createdAt > arr[a].createdAt) {
              arr.splice(a, 0, momentObj);
              break;
            } else if (arr.length - 1 == a) {
              arr.push(momentObj);
            }
          }
        }
        index = index + 1;
      }
      foundFollowingMoments[mainindex] = arr;
    }

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

const getUserMoments = async (req, res, next) => {
  try {
    let { userId } = req.params;
    if (!userId) throw new Error("Please pass user ID");

    let userMoments = await Moment.find({ host: userId });

    userMoments && res.status(200).json(userMoments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getMomentsByUserId,
  getMomentsOfUser,
  getUserMoments,
};
