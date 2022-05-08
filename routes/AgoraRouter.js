const express = require("express");
const {
  generateAgoraToken,
  generateRtmAgoraToken,
} = require("../controllers/agoraToken/generateAgoraToken");
const { uploadFile } = require("../controllers/test/index");

const AgoraRouter = express.Router();

AgoraRouter.get("/getToken", generateAgoraToken);
AgoraRouter.get("/getRtmToken", generateRtmAgoraToken);
AgoraRouter.post("/testUpload", uploadFile);

module.exports = AgoraRouter;
