const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: String,
    },
    views: [],
    tags: [],
    color: [],
    comments: [CommentSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

CardSchema.virtual("commentCount").get(function () {
  if (this.comments) {
    return this.comments.length;
  }
});

CardSchema.virtual("likeCount").get(function () {
  if (this.likes) {
    return this.likes.length;
  }
});

const Cards = mongoose.model("Card", CardSchema);
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
