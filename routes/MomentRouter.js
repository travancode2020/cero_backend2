const express = require("express");

//import controllers
const {
  getAllMoments,
  deleteAllMoments,
} = require("../controllers/moment/main.js");

const MomentRouter = express.Router();

MomentRouter.get("/", getAllMoments);
MomentRouter.delete("/", deleteAllMoments);

module.exports = MomentRouter;
