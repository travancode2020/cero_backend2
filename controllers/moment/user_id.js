const { Types } = require("mongoose");
const { Moment } = require("../../modals/Moment.js");
const Users = require("../../modals/User.js");

const getMomentsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

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
          "host.agoraId": 1,
          moments: 1,
        },
      },
    ]);
    let mainindex = 0;
    let agoraIdSorting = [];
    for (let followingObj of foundFollowingMoments) {
      let arr = [];
      let index = 0;
      for (let momentObj of followingObj.moments) {
        let isInserted = false;
        if (index == 0) {
          arr.push(momentObj);
        } else {
          let arrIndex = 0;
          for (let arrObj of arr) {
            if (momentObj.createdAt > arrObj.createdAt && !isInserted) {
              arr.splice(arrIndex, 0, momentObj);
              isInserted = true;
            } else if (arr.length - 1 == arrIndex && !isInserted) {
              arr.push(momentObj);
              isInserted = true;
            }
            arrIndex = arrIndex + 1;
          }
        }
        index = index + 1;
      }
      followingObj.moments = arr;

      let agoraIndex = 0;
      let agoraNested = false;
      if (mainindex == 0) {
        agoraIdSorting.push(followingObj);
      } else {
        for (let userObj of agoraIdSorting) {
          if (
            userObj.host.agoraId < followingObj.host.agoraId &&
            !agoraNested
          ) {
            agoraIdSorting.splice(agoraIndex, 0, followingObj);
            agoraNested = true;
          } else if (agoraIdSorting.length - 1 == agoraIndex && !agoraNested) {
            agoraIdSorting.push(followingObj);
            agoraNested = true;
          }
          agoraIndex = agoraIndex + 1;
        }
      }

      mainindex = mainindex + 1;
    }
    let data = [];
    for (let followingObj of agoraIdSorting) {
      let viewed = false;
      if (followingObj.moments[0].views.length > 0) {
        followingObj.moments[0].views.map((obj) => {
          if (obj == userId) {
            viewed = true;
          }
        });
      }

      if (viewed) {
        data.push(followingObj);
      } else {
        data.splice(0, 0, followingObj);
      }
    }
    let totalPages = Math.ceil(data.length / limit);
    data = data.slice(skip, skip + limit);

    res.status(200).json({
      totalPages,
      hostMoments: foundUserMoments,
      followingMoments: data,
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
    next(error);
  }
};

module.exports = {
  getMomentsByUserId,
  getMomentsOfUser,
  getUserMoments,
};
