const admin = require("firebase-admin");
const sendFirebaseNotification = async (title, message, data, token) => {
  try {
    const payload = {
      notification: {
        title: title,
        body: message,
      },
      data: data,
    };
    const response = await admin.messaging().sendToDevice(token, payload);
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendFirebaseNotification,
};
