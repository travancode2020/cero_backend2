const express = require("express");
const {
  addRemoveInterest,
  getInterest,
} = require("../controllers/interest/main");

const InterestRouter = express.Router();

InterestRouter.post("/addRemove", addRemoveInterest);
InterestRouter.get("/", getInterest);

module.exports = InterestRouter;
