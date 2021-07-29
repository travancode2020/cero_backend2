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

var Cards = mongoose.model("Card", CardSchema);
module.exports = Cards;
