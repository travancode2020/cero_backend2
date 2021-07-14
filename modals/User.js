const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

var commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },

    author_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var cardSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },

    isImage: {
      type: Boolean,
      required: true,
    },
    Likes: {
      type: Number,
      required: true,
    },
    Saved: {
      type: Number,
      required: true,
    },

    Hostid: {
      type: String,
      required: true,
    },
    HostName: {
      type: String,
      required: true,
    },
    HostPropic: {
      type: String,
      required: true,
    },

    Tags: {
      type: String,
      required: true,
    },

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var cardSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },

    isImage: {
      type: Boolean,
      required: true,
    },
    Likes: {
      type: Number,
      required: true,
    },
    Saved: {
      type: Number,
      required: true,
    },

    Hostid: {
      type: String,
      required: true,
    },
    HostName: {
      type: String,
      required: true,
    },
    HostPropic: {
      type: String,
      required: true,
    },

    Tags: {
      type: String,
      required: true,
    },

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },

    user_name: {
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

    date_join: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    photo_url: {
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

    numSatisaction: {
      type: Number,
      required: true,
    },

    cryptoBal: {
      type: Number,
      required: true,
    },

    streak: {
      type: Number,
    },

    interest: {
      type: String,
      required: true,
    },

    Cards: [cardSchema],
    followers: [followerSchema],
    verifiedProfiles: [verifiedProfilesSchema],
    following: [followingSchema],
    saved: [savedSchema],
  },
  {
    timestamps: true,
  }
);

var users = mongoose.model("User", UserSchema);
module.exports = users;
