const Users = require("../../modals/User.js");

const getUserByFID = async (req, res, next) => {
  try {
    const fId = req.params.fId;

    const foundUser = await Users.findOne({ fId: fId });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserByFID,
};
