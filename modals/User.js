const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = new Schema(
  {
    title: {
      type: String,
    },
    detail: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    views: [],
  },
  {
    timestamps: true,
  }
);

const StreakSchema = new Schema({
  lastDate: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  highestScore: {
    type: Number,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    fId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    photoUrl: {
      type: String,
    },
    dob: {
      type: String,
      required: true,
    },
    isCreator: {
      type: Boolean,
      required: true,
    },
    isPro: {
      type: Boolean,
      required: true,
    },
    satisfaction: {
      type: Number,
    },
    proBio: {
      type: String,
    },
    work: [WorkSchema],
    streak: {
      type: StreakSchema,
      default: null,
    },
    userTag: [
      {
        type: String,
      },
    ],
    interest: [
      {
        type: String,
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verifiedProfiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    liked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    viewed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    isLocationSharingEnabled: {
      type: Boolean,
      default: false,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  {
    timestamps: true,
  }
);

var users = mongoose.model("User", UserSchema);
module.exports = users;
