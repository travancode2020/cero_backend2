const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkSchema = new Schema(
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
    views: [],
  },

  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
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
    cryptoBal: {
      type: Number,
    },
    proBio: {
      type: String,
    },
    work: [WorkSchema],
    streak: {
      type: Number,
    },
    userTag: [],
    interest: [],
    followers: [],
    verifiedProfiles: [],
    following: [],
    saved: [],
    liked: [],
    viewed: [],
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
