const Agora = require("agora-access-token");
const Users = require("../../modals/User");
const generateAgoraToken = async (req, res, next) => {
  try {
    let { agoraId, channel, isHost } = req.query;
    if (!agoraId && !channel)
      throw new Error("Please Enter AgoraId and Channel name");

    let isUserExists = await Users.findOne({ agoraId });
    if (!isUserExists) throw new Error("User not found with this Id");

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const role =
      isHost == "true" ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;

    const token = await Agora.RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      agoraId,
      role,
      privilegeExpiredTs
    );

    if (!token) throw new Error("something went wrong while generating token");
    token && res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

const generateRtmAgoraToken = async (req, res, next) => {
  try {
    let { agoraId } = req.query;
    if (!agoraId) throw new Error("Please Enter AgoraId and Channel name");

    let isUserExists = await Users.findOne({ agoraId });
    if (!isUserExists) throw new Error("User not found with this Id");

    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const role = Agora.RtmRole;

    const token = await Agora.RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      agoraId,
      role,
      privilegeExpiredTs
    );

    if (!token) throw new Error("something went wrong while generating token");
    token && res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateAgoraToken, generateRtmAgoraToken };
