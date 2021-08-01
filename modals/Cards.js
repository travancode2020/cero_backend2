const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
    },

    likes: [],
    replyTo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const CardSchema = new Schema(
  {
    link: [],

    isImage: {
      type: Boolean,
      required: true,
    },

    disLikes: [],

    saved: [],

    likes: [],

    hostId: {
      type: String,
      required: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    hostPropic: {
      type: String,
    },
    caption: {
      type: String,
    },

    views: [],

    tags: [],

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Cards = mongoose.model("Card", CardSchema);
module.exports = Cards;

/*
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
    _id: {
      type: String,
    },

    user_name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var dislikesSchema = new Schema(
  {
    _id: {
      type: String,
    },

    user_name: {
      type: String,
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
*/
