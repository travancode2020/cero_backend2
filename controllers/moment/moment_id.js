const { Moment } = require("../../modals/Moment.js");
const Users = require("../../modals/User.js");
const { Types } = require("mongoose");

const getMomentById = async (req, res, next) => {
  try {
    const momentId = req.params.momentId;

    const foundMoment = await Moment.aggregate([
      { $match: { _id: Types.ObjectId(momentId) } },
      {
        $lookup: {
          from: "users",
          let: { views: "$views" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$views"] } } },
            {
              $project: {
                name: 1,
                userName: 1,
                photoUrl: 1,
              },
            },
          ],
          as: "viewers",
        },
      },
      {
        $project: {
          viewers: 1,
        },
      },
    ]);

    if (foundMoment) {
      return res.status(200).json(foundMoment[0].viewers);
    }

    res.status(404).json({ message: "Moment not found" });
  } catch (error) {
    next(error);
  }
};

const deleteMomentById = async (req, res, next) => {
  try {
    const momentId = req.params.momentId;

    await Moment.deleteOne({ _id: momentId });

    res.status(200).json({ message: "Moment deleted" });
  } catch (error) {
    next(error);
  }
};

const addViewByMomentId = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const momentId = req.params.momentId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
    }

    const isUserExists = await Users.exists({ _id: userId });
    const isMomentExists = await Moment.exists({ _id: momentId });
    if (!isUserExists) {
      res.status(404).json({ message: "User is not found" });
    }
    if (!isMomentExists) {
      res.status(404).json({ message: "Moment is not found" });
    }

    await Moment.findByIdAndUpdate(momentId, { $addToSet: { views: userId } });

    res.status(200).json({ message: "Moment Updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMomentById,
  deleteMomentById,
  addViewByMomentId,
};
