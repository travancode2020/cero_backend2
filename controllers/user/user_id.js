const Users = require("../../modals/User.js");

const getUserByUserId = (req, res, next) => {
  Users.findById(req.params.userid)
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const postUserByUserId = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.params.userid,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteUserByUserId = (req, res, next) => {
  Users.findByIdAndRemove(req.params.userid)
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    var resourceToUpdate = req.body.resourceToUpdate;
    var newResource = req.body.newResource;
    const confidentialResource = [
      "password",
      "email",
      "fId",
      "followers",
      "following",
      "verifiedProfiles",
      "saved",
      "liked",
      "viewed",
      "isLocationSharingEnabled",
      "location",
    ];

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!resourceToUpdate || !newResource) {
      return res
        .status(400)
        .json({ message: "required body parameters are missing" });
    }

    if (resourceToUpdate === "isPro" || resourceToUpdate === "isCreator") {
      newResource =
        newResource === "true" ? true : newResource === "false" ? false : null;
    }

    const isUserExists = await Users.exists({ _id: userId });
    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (confidentialResource.includes(resourceToUpdate)) {
      res.status(404).json({
        message:
          "Cannot update this particular resource without proper permissions",
      });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $set: { [`${resourceToUpdate}`]: newResource } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getUserByAgoraId = async (req, res, next) => {
  try {
    let { agoraId } = req.params;
    if (!agoraId) throw new Error("please pass agoraId");

    let userData = await Users.findOne({ agoraId });
    if (!userData) throw new Error("User not found");

    userData && res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserByUserId,
  postUserByUserId,
  deleteUserByUserId,
  updateUserProfile,
  getUserByAgoraId,
};
