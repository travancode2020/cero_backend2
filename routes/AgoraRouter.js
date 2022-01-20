const express = require("express");
const {
  generateAgoraToken,
  generateRtmAgoraToken,
} = require("../controllers/agoraToken/generateAgoraToken");

const AgoraRouter = express.Router();

AgoraRouter.get("/getToken", generateAgoraToken);
AgoraRouter.get("/getRtmToken", generateRtmAgoraToken);

module.exports = AgoraRouter;
