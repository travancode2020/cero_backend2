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
    const foundFollowingMoments = await Moment.find({
      host: {
        $in: foundUser.following,
      },
    }).populate({
      path: "host",
      select: ["name", "userName", "photoUrl", "fId"],
    });

    res.status(200).json({
      hostMoments: foundUserMoments,
      followingMoments: foundFollowingMoments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMomentsByUserId,
};
