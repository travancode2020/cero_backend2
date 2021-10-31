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
  patchWorkByWorkId,
  deleteWorkByWorkId,
} = require("../controllers/user/user_id_work_id.js");

const { getUserByFID } = require("../controllers/user/fId.js");

const {
  followByUserId,
  unfollowByUserId,
} = require("../controllers/user/following.js");

const {
  getVerifiedProfilesByUserId,
  postVerifiedProfilesByUserId,
  deleteVerifiedProfilesByUserId,
} = require("../controllers/user/verified.js");

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
UserRouter.patch("/:userId/work/:workId", patchWorkByWorkId);
UserRouter.delete("/:userId/work/:workId", deleteWorkByWorkId);

//controller/user/fId.js
UserRouter.get("/fId/:fId", getUserByFID);

//controller/user/following.js
UserRouter.post("/follow/:userId", followByUserId);
UserRouter.post("/unfollow/:userId", unfollowByUserId);

//controllers/user/verified.js
UserRouter.get("/:userId/verified", getVerifiedProfilesByUserId);
UserRouter.post("/:userId/verified", postVerifiedProfilesByUserId);
UserRouter.delete("/:userId/verified", deleteVerifiedProfilesByUserId);

module.exports = UserRouter;
