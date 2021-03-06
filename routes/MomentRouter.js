const express = require("express");

//import controllers
const {
  getAllMoments,
  deleteAllMoments,
  createMoment,
} = require("../controllers/moment/main.js");

const {
  getMomentById,
  deleteMomentById,
  addViewByMomentId,
} = require("../controllers/moment/moment_id.js");

const {
  getMomentsByUserId,
  getMomentsOfUser,
  getUserMoments,
} = require("../controllers/moment/user_id.js");

const MomentRouter = express.Router();

//controllers/moment/main.js
MomentRouter.get("/", getAllMoments);
MomentRouter.delete("/", deleteAllMoments);
MomentRouter.post("/", createMoment);

//controllers/moment/moment_id.js
MomentRouter.get("/:momentId", getMomentById);
MomentRouter.delete("/:momentId", deleteMomentById);
MomentRouter.post("/:momentId", addViewByMomentId);

//controllers/moment/user_id.js
MomentRouter.get("/user/:userId", getMomentsByUserId);
MomentRouter.get("/:userId", getMomentsOfUser);
MomentRouter.get("/userMoment/:userId", getUserMoments);

module.exports = MomentRouter;
