const express = require("express");

// Import controllers
const {
  getAllUsers,
  createUser,
  patchUserByUsername,
  deleteAllUsers,
} = require("../controllers/user/main.js");

const {
  getUserByUserId,
  postUserByUserId,
  patchUserByUserId,
  putUserByUserId,
  deleteUserByUserId,
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
  getFollowersByUserId,
  postFollowersByUserId,
  deleteFollowersByUserId,
} = require("../controllers/user/user_id_followers.js");

const {
  getFollowerByFollowerId,
  deleteFollowerByFollowerId,
} = require("../controllers/user/user_id_follower_id.js");

const {
  getVerifiedByUserId,
  postVerifiedByUserId,
  deleteVerifiedByUserId,
} = require("../controllers/user/user_id_verified.js");

const {
  getVerifiedByVerifiedId,
  deleteVerifiedByVerifiedId,
} = require("../controllers/user/user_id_verified_id.js");

const {
  getFollowingByUserId,
  postFollowingByUserId,
  deleteFollowingByUserId,
} = require("../controllers/user/user_id_following.js");

const {
  getFollowingByFollowingId,
  deleteFollowingByFollowingId,
} = require("../controllers/user/user_id_following_id.js");

const UserRouter = express.Router();

// controllers/user/main.js
UserRouter.get("/", getAllUsers);
UserRouter.post("/", createUser);
UserRouter.put("/", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /Users");
});
UserRouter.patch("/", patchUserByUsername);
UserRouter.delete("/", deleteAllUsers);

// controllers/user/user_id.js
UserRouter.get("/:userid", getUserByUserId);
UserRouter.patch("/:userid", patchUserByUserId);
UserRouter.post("/:userid", postUserByUserId);
UserRouter.put("/:userid", putUserByUserId);
UserRouter.delete("/:userid", deleteUserByUserId);

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

//controllers/user/user_id_followers.js
UserRouter.get("/:userId/followers", getFollowersByUserId);
UserRouter.post("/:userId/followers", postFollowersByUserId);
UserRouter.put("/:userId/followers", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /followers");
});
UserRouter.delete("/:userId/followers", deleteFollowersByUserId);

//controllers/user/user_id_follower_id.js
UserRouter.get("/:userId/followers/:followerId", getFollowerByFollowerId);
UserRouter.delete("/:userId/followers/:followerId", deleteFollowerByFollowerId);

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

//controllers/user/user_id_following.js
UserRouter.get("/:userId/following", getFollowingByUserId);
UserRouter.post("/:userId/following", postFollowingByUserId);
UserRouter.put("/:userId/following", (_, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /following");
});
UserRouter.delete("/:userId/following", deleteFollowingByUserId);

//controller/user/user_id_following_id.js
UserRouter.get("/:userId/following/:followingId", getFollowingByFollowingId);
UserRouter.delete(
  "/:userId/following/:followingId",
  deleteFollowingByFollowingId
);

module.exports = UserRouter;
