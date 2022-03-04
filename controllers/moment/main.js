const { Moment } = require("../../modals/Moment.js");
const User = require("../../modals/User.js");
const { sendFirebaseNotification } = require("../fireBaseNotification/main");

const getAllMoments = async (req, res, next) => {
  try {
    const userPopulateQuery = [
      {
        path: "views",
        select: ["userName", "fId", "name", "photoUrl", "userTag"],
      },
    ];
    const allMoments = await Moment.find({}).populate(userPopulateQuery);

    res.status(200).json(allMoments);
  } catch (error) {
    next(error);
  }
};

const deleteAllMoments = async (req, res, next) => {
  try {
    await Moment.remove({}).then((response) => res.status(200).json(response));
  } catch (error) {
    next(error);
  }
};

const createMoment = async (req, res, next) => {
  try {
    const momentBody = req.body;
    const newMoment = await Moment.create(momentBody);
    const notificationData = { _id: newMoment._id.toString() };
    const hostId = req.body.host;
    let hostData = await User.findOne({ _id: hostId });
    let hostFollowers = hostData.followers;
    let followersData = await User.find({ _id: { $in: hostFollowers } });
    for (let obj of followersData) {
      let notificationToken = obj.notificationToken;
      await sendFirebaseNotification(
        "cero",
        `${hostData.userName} recently added to their moment`,
        notificationData,
        notificationToken
      );
    }
    res.status(200).json(newMoment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMoments,
  deleteAllMoments,
  createMoment,
};
