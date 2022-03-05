const admin = require("firebase-admin");
const Notification = require("../../modals/notification");
const { Types } = require("mongoose");
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

    let userNotifications = await Notification.aggregate([
      { $match: { userId: Types.ObjectId(id) } },
      { $unwind: "$data" },
      {
        $lookup: {
          from: "users",
          let: {
            triggeredId: { $toObjectId: "$data.triggered_by" },
            data: "$data",
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$triggeredId"] } } },
            {
              $project: {
                name: 1,
                userName: 1,
                photoUrl: 1,
              },
            },
          ],
          as: "data.triggered_by_user",
        },
      },
      {
        $unwind: {
          path: "$data.triggered_by_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "cards",
          let: {
            action_id: { $toObjectId: "$data.action_id" },
            data: "$data",
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$action_id"] } } },
            {
              $project: {
                _id: 0,
                action_id: "$_id",
                action_photo: { $first: "$links" },
              },
            },
          ],
          as: "data.action_id_card",
        },
      },
      {
        $unwind: {
          path: "$data.action_id_card",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            action_id: { $toObjectId: "$data.action_id" },
            data: "$data",
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$action_id"] } } },
            {
              $project: {
                _id: 0,
                action_id: "$_id",
                action_photo: "$photoUrl",
              },
            },
          ],
          as: "data.action_id_user",
        },
      },
      {
        $unwind: {
          path: "$data.action_id_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "data._id": 1,
          "data.type": 1,
          "data.notification": 1,
          "data.createdAt": 1,
          "data.action_data": {
            $switch: {
              branches: [
                {
                  case: { $ifNull: ["$data.action_id_user", false] },
                  then: "$data.action_id_user",
                },
                {
                  case: { $ifNull: ["$data.action_id_card", false] },
                  then: "$data.action_id_card",
                },
              ],
              default: { action_id: "$data.action_id", action_photo: null },
            },
          },
          "data.triggered_by": {
            $switch: {
              branches: [
                {
                  case: { $ifNull: ["$data.triggered_by_user", false] },
                  then: "$data.triggered_by_user",
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          data: { $push: "$data" },
        },
      },
    ]);

    if (!userNotifications) throw new Error("notification not found");
    userNotifications && res.status(200).send(userNotifications[0].data);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  sendFirebaseNotification,
  saveNotification,
  getUserNotification,
};
