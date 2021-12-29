const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialGuest: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dateAndTime: {
      type: Date,
      require: true,
    },
    isPrivate: {
      type: Boolean,
      require: true,
    },
    inviteOrScheduledUser: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Rooms = mongoose.model("Rooms", RoomSchema);
module.exports = Rooms;
