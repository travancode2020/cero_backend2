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
        "copxESC6R2ur0OAbnTa_T0:APA91bGEivRZ_hu10Y3TjE6CwlTGStabWzF-TI0nL-JhEmCgq94LDGMO6Wo8Lh7kLo4Yz1Il1E882UoWPFgzC2nwVyH1ZYDMXzr6j8TPvQmac7-uW9CapCwKe1jV3OuJvlR0if45L6tA",
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
