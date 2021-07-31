const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

var commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    _id: {
      type: String,
      required: true,
    },

    user_name: {
      type: String,
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

    dislikes: [dislikesSchema],

    Saved: {
      type: Number,
      required: true,
    },

    Likes: [LikesSchema],

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

var Cards = mongoose.model("Card", CardSchema);
module.exports = Cards;
