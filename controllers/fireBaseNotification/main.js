const admin = require("firebase-admin");
const sendFirebaseNotification = async (title, message, token) => {
  try {
    const payload = {
      notification: {
        title: title,
        body: message,
      },
    };
    const response = await admin
      .messaging()
      .sendToDevice(
        "dTz_pMfVTzih2I2KzYNlp5:APA91bFBl85sdWVY2RnNYUUigkcaiQax58Pn0klrn0_43Ah1DixMWgQOdhPd7wRoAcT1W91trMq2UcQjOCKpsgqRqBVybSH9xWAB6TaNsq0MSjRoZllTm_uY-CrnBEs3TmZTNyF-VMTb",
        payload
      );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendFirebaseNotification,
};
