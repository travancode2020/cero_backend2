const { Moment } = require("../../modals/Moment.js");

const getMomentById = async (req, res, next) => {
  try {
    const momentId = req.params.momentId;

    const foundMoment = await Moment.find({ _id: momentId });

    if (foundMoment) {
      return res.status(200).json(foundMoment);
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

module.exports = {
  getMomentById,
  deleteMomentById,
};
