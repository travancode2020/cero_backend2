const Users = require("../../modals/User.js");

const followByUserId = async (req, res, next) => {
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
      $addToSet: { following: followingId },
    });
    await Users.findByIdAndUpdate(followingId, {
      $addToSet: { followers: userId },
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

module.exports = {
  followByUserId,
  unfollowByUserId,
};