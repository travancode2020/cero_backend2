const express = require("express");
const UserRouter = require("./UserRouter.js");
const CardRouter = require("./CardRouter.js");
const MomentRouter = require("./MomentRouter.js");
const LocationRouter = require("./LocationRouter.js");
const AuthRouter = require("./AuthRouter.js");
const AgoraRouter = require("./AgoraRouter");
const RoomRouter = require("./RoomRouter");
const InterestRouter = require("./InterestRouter");
const NotificationRouter = require("./NotificationRouter");
const ReportRouter = require("./ReportRouter");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = {
  IndexRouter: router,
  UserRouter,
  CardRouter,
  MomentRouter,
  LocationRouter,
  AuthRouter,
  AgoraRouter,
  RoomRouter,
  InterestRouter,
  NotificationRouter,
  ReportRouter,
};
