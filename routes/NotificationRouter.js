const express = require("express");
const {
  getUserNotification,
} = require("../controllers/fireBaseNotification/main");

const NotificationRouter = express.Router();

NotificationRouter.get("/", getUserNotification);

module.exports = NotificationRouter;
