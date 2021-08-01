const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var workSchema = new Schema(
  {
    uId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    detail: {
      type: String,
    },

    images: [],

    views: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },

    userName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
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
      required: true,
    },

    photoUrl: {
      type: String,
      required: true,
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
      required: true,
    },

    cryptoBal: {
      type: Number,
      required: true,
    },

    proBio: {
      type: String,
    },

    work: [workSchema],

    streak: {
      type: Number,
    },
    userTag: [],

    interest: [],

    followers: [],
    verifiedProfiles: [],
    following: [],
    saved: [],
  },
  {
    timestamps: true,
  }
);

var users = mongoose.model("User", UserSchema);
module.exports = users;

/*
var savedSchema = new Schema({});

var followingSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

var verifiedProfilesSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

var followerSchema = new Schema({
  follower_id: {
    type: String,
    required: true,
  },

  follower_name: {
    type: String,
    required: true,
  },

  photo_url: {
    type: String,
    required: true,
  },
});
*/
