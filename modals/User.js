const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var workSchema = new Schema(
  {
    id: {
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
      id: {
        type: String,
        required: true,
      },

      user_name: {
        type: String,
      },
    },
  },

  {
    timestamps: true,
  }
);

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

var tagsSchema = new Schema(
  {
    mainCat: {
      type: String,
    },

    subCat: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var LikesSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var dislikesSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var linkSchema = new Schema(
  {
    link_url: {
      type: String,
    },

    image: {
      type: Boolean,
    },
  },

  {
    timestamps: true,
  }
);

var commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CardSchema = new Schema(
  {
    link: [linkSchema],

    isImage: {
      type: Boolean,
      required: true,
    },
    Likes: [LikesSchema],

    dislikes: [dislikesSchema],

    Saved: {
      type: Number,
      required: true,
    },

    id: {
      type: String,
      required: true,
      unique: true,
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
    Caption: {
      type: String,
    },

    Tags: [tagsSchema],

    comments: [commentSchema],
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

    password: {
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

    numSatisfaction: {
      type: Number,
      required: true,
    },

    cryptoBal: {
      type: Number,
      required: true,
    },

    ProBio: {
      type: String,
    },

    work: [workSchema],

    streak: {
      type: Number,
    },

    interest: [],

    Cards: [CardSchema],
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
