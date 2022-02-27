const admin = require("firebase-admin");
const Notification = require("../../modals/notification");
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

const saveNotification = async (userId, notificationData) => {
  try {
    let getNotificationData = await Notification.findOne({ userId });
    let notificationSaved;
    if (getNotificationData) {
      getNotificationData.data.splice(0, 0, notificationData);
      if (getNotificationData.data.length > 50) {
        getNotificationData.data = getNotificationData.data.slice(0, 50);
      }

      notificationSaved = await Notification.findOneAndUpdate(
        { userId },
        { data: getNotificationData.data }
      );
    } else {
      notificationSaved = await Notification.create({
        userId,
        data: [notificationData],
      });
    }
    return notificationSaved;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

const getUserNotification = async (req, res, next) => {
  try {
    let { id } = req.query;
    if (!id) throw new Error("please pass _id");

    let userNotifications = await Notification.findOne({ userId: id });

    if (!userNotifications) throw new Error("notification not found");
    userNotifications && res.status(200).send(userNotifications.data);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  sendFirebaseNotification,
  saveNotification,
  getUserNotification,
};
