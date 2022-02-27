const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationData = require("./schema/notificationData");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: [new mongoose.Schema(notificationData)],
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
