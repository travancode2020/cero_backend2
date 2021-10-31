const Users = require("../../modals/User.js");

const getVerifiedProfilesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const foundUser = await Users.findById(userId).populate({
      path: "verifiedProfiles",
      select: ["userName", "name", "photoUrl"],
    });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser.verifiedProfiles);
  } catch (error) {}
};

const postVerifiedProfilesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const verifiedProfileId = req.body.verifiedProfileId;

    if (!verifiedProfileId) {
      return res.status(400).json({ message: "verifiedProfileId is required" });
    }

    const isUserExists = await Users.exists({ _id: userId });

    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const isVerifiedProfileExists = await Users.exists({
      _id: verifiedProfileId,
    });

    if (!isVerifiedProfileExists) {
      return res.status(404).json({ message: "Verified Profile not found" });
    }

    await Users.findByIdAndUpdate(userId, {
      $addToSet: { verifiedProfiles: verifiedProfileId },
    });

    res.status(200).json({ message: "User updated" });
  } catch (error) {}
};

const deleteVerifiedProfilesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const verifiedProfileId = req.body.verifiedProfileId;

    if (!verifiedProfileId) {
      return res.status(400).json({ message: "verifiedProfileId is required" });
    }

    const isUserExists = await Users.exists({ _id: userId });

    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const isVerifiedProfileExists = await Users.exists({
      _id: verifiedProfileId,
    });

    if (!isVerifiedProfileExists) {
      return res.status(404).json({ message: "Verified Profile not found" });
    }

    await Users.findByIdAndUpdate(userId, {
      $pull: { verifiedProfiles: verifiedProfileId },
    });

    res.status(200).json({ message: "User updated" });
  } catch (error) {}
};

module.exports = {
  getVerifiedProfilesByUserId,
  postVerifiedProfilesByUserId,
  deleteVerifiedProfilesByUserId,
};
