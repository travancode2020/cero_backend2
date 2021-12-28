const express = require("express");
const {
  generateAgoraToken,
} = require("../controllers/agoraToken/generateAgoraToken");

const AgoraRouter = express.Router();

AgoraRouter.get("/getToken", generateAgoraToken);

module.exports = AgoraRouter;
