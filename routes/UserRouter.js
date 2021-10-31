const express = require("express");

// Import controllers
const {
  getAllUsers,
  createUser,
  patchUserByUsername,
  deleteAllUsers,
  checkUsernameExists,
} = require("../controllers/user/main.js");

const {
  getUserByUserId,
  postUserByUserId,
  deleteUserByUserId,
  updateUserProfile,
} = require("../controllers/user/user_id.js");

const {
  getWorkByUserId,
  postWorkByUserId,
  deleteWorkByUserId,
} = require("../controllers/user/user_id_work.js");

const {
  getWorkByWorkId,
  putWorkByWorkId,
  patchWorkByWorkId,
  deleteWorkByWorkId,
} = require("../controllers/user/user_id_work_id.js");

const {
  getVerifiedByUserId,
  postVerifiedByUserId,
  deleteVerifiedByUserId,
} = require("../controllers/user/user_id_verified.js");

const {
  getVerifiedByVerifiedId,
  deleteVerifiedByVerifiedId,
} = require("../controllers/user/user_id_verified_id.js");

const { getUserByFID } = require("../controllers/user/fId.js");

const {
  followByUserId,
  unfollowByUserId,
} = require("../controllers/user/following.js");

const UserRouter = express.Router();

// controllers/user/main.js
UserRouter.get("/", getAllUsers);
UserRouter.post("/", createUser);
UserRouter.post("/check/username", checkUsernameExists);
UserRouter.put("/", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /Users");
});
UserRouter.patch("/", patchUserByUsername);
UserRouter.delete("/", deleteAllUsers);

// controllers/user/user_id.js
UserRouter.get("/:userid", getUserByUserId);
UserRouter.post("/:userid", postUserByUserId);
UserRouter.delete("/:userid", deleteUserByUserId);
UserRouter.patch("/:userId", updateUserProfile);

//controllers/user/user_id_work.js
UserRouter.get("/:userId/work", getWorkByUserId);
UserRouter.post("/:userId/work", postWorkByUserId);
UserRouter.put("/:userId/work", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /Cards");
});
UserRouter.delete("/:userId/work", deleteWorkByUserId);

//controllers/user/user_id_work_id.js
UserRouter.get("/:userId/work/:workId", getWorkByWorkId);
UserRouter.post("/:userId/work/:workId", (req, res) => {
  res.statusCode = 403;
  res.end(
    "POST operation not supported on /work/" +
      req.params.workId +
      "/work/" +
      req.params.userId
  );
});
UserRouter.put("/:userId/work/:workId", putWorkByWorkId);
UserRouter.patch("/:userId/work/:workId", patchWorkByWorkId);
UserRouter.delete("/:userId/work/:workId", deleteWorkByWorkId);

//controllers/user/user_id_verified.js
UserRouter.get("/:userId/verifiedprofiles", getVerifiedByUserId);
UserRouter.post("/:userId/verifiedprofiles", postVerifiedByUserId);
UserRouter.put("/:userId/verifiedprofiles", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /verified profiles");
});
UserRouter.delete("/:userId/verifiedprofiles", deleteVerifiedByUserId);

//controllers/user/user_id_verified_id.js
UserRouter.get(
  "/:userId/verifiedprofiles/:verifiedId",
  getVerifiedByVerifiedId
);
UserRouter.delete(
  "/:userId/verifiedprofiles/:verifiedId",
  deleteVerifiedByVerifiedId
);

//controller/user/fId.js
UserRouter.get("/fId/:fId", getUserByFID);

//controller/user/following.js
UserRouter.post("/follow/:userId", followByUserId);
UserRouter.post("/unfollow/:userId", unfollowByUserId);

module.exports = UserRouter;
