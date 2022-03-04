const Users = require("../../modals/User.js");
const { Types } = require("mongoose");
const {
  sendFirebaseNotification,
  saveNotification,
} = require("../fireBaseNotification/main");

const followByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const followingId = req.body.followingId;
    const notificationToken = req.body.followingUserNotificationToken;

    const isUserExists = await Users.findOne({ _id: userId });
    const isFollowingUserExists = await Users.findOne({ _id: followingId });

    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isFollowingUserExists) {
      return res.status(404).json({ message: "Following User not found" });
    }

    await Users.findByIdAndUpdate(userId, {
      $addToSet: { following: followingId },
    });
    await Users.findByIdAndUpdate(followingId, {
      $addToSet: { followers: userId },
    });
    const notificationData = { _id: isUserExists._id.toString() };
    await sendFirebaseNotification(
      "cero",
      `${isUserExists.userName} started following you`,
      notificationData,
      isFollowingUserExists.notificationToken
    );
    await saveNotification(isFollowingUserExists._id, {
      type: 3,
      notification: `${isUserExists.userName} started following you`,
      action_id: notificationData._id,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const unfollowByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const followingId = req.body.followingId;

    const isUserExists = await Users.exists({ _id: userId });
    const isFollowingUserExists = await Users.exists({ _id: followingId });

    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isFollowingUserExists) {
      return res.status(404).json({ message: "Following User not found" });
    }

    await Users.findByIdAndUpdate(userId, {
      $pull: { following: followingId },
    });
    await Users.findByIdAndUpdate(followingId, {
      $pull: { followers: userId },
    });

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const getFollowersByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    const foundUser = await Users.findById(userId).populate({
      path: "followers",
      select: ["userName", "name", "photoUrl", "fId"],
    });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let followers = foundUser.followers.slice(skip, skip + limit);
    let totalPages = Math.ceil(foundUser.followers.length / limit);

    res.status(200).json({ totalPages, data: followers });
  } catch (error) {
    next(error);
  }
};

const getFollowingByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    const foundUser = await Users.findById(userId).populate({
      path: "following",
      select: ["userName", "name", "photoUrl", "fId"],
    });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let following = foundUser.following.slice(skip, skip + limit);
    let totalPages = Math.ceil(foundUser.following.length / limit);

    res.status(200).json({ totalPages, data: following });
  } catch (error) {
    next(error);
  }
};

const searchFollowingUser = async (req, res, next) => {
  try {
    let { searchFilter, _id, page, limit } = req.query;
    searchFilter = searchFilter ? searchFilter : "";
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let data = await Users.aggregate([
      {
        $match: { _id: Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "followeingsData",
        },
      },
      { $unwind: "$followeingsData" },
      {
        $match: {
          $or: [
            {
              "followeingsData.userName": {
                $regex: `^${searchFilter}`,
                $options: "i",
              },
            },
            {
              "followeingsData.name": {
                $regex: `^${searchFilter}`,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          userName: "$followeingsData.userName",
          name: "$followeingsData.name",
          _id: "$followeingsData._id",
          photoUrl: "$followeingsData.photoUrl",
        },
      },
      {
        $project: { name: 1, userName: 1, _id: 1, photoUrl: 1 },
      },
    ]);

    let count = data.slice(skip, skip + limit);
    let totalPages = Math.ceil(data.length / limit);

    res.status(200).json({ totalPages, data });
  } catch (error) {
    next();
  }
};

const searchFollowersUser = async (req, res, next) => {
  try {
    let { searchFilter, _id, page, limit } = req.query;
    searchFilter = searchFilter ? searchFilter : "";
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let data = await Users.aggregate([
      {
        $match: { _id: Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followersData",
        },
      },
      { $unwind: "$followersData" },
      {
        $match: {
          $or: [
            {
              "followersData.userName": {
                $regex: `^${searchFilter}`,
                $options: "i",
              },
            },
            {
              "followersData.name": {
                $regex: `^${searchFilter}`,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $addFields: {
          _id: "$followersData._id",
          userName: "$followersData.userName",
          name: "$followersData.name",
          photoUrl: "$followersData.photoUrl",
        },
      },
      {
        $project: {
          name: 1,
          userName: 1,

          photoUrl: 1,
        },
      },
    ]);

    let count = data.slice(skip, skip + limit);
    let totalPages = Math.ceil(data.length / limit);

    res.status(200).json({ totalPages, data });
  } catch (error) {
    next();
  }
};

module.exports = {
  followByUserId,
  unfollowByUserId,
  getFollowersByUserId,
  getFollowingByUserId,
  searchFollowingUser,
  searchFollowersUser,
};
