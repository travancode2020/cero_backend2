const express = require("express");
const UserRouter = require("./UserRouter.js");
const CardRouter = require("./CardRouter.js");
const MomentRouter = require("./MomentRouter.js");

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
};
