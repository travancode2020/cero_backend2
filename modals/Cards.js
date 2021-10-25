const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const CardSchema = new Schema({
  links: [
    {
      type: String,
    },
  ],
  isImage: {
    type: Boolean,
    required: true,
  },
  disLikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caption: {
    type: String,
  },
  views: [],
  tags: [
    {
      type: String,
    },
  ],
  color: [
    {
      type: String,
    },
  ],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

CardSchema.set("toObject", { virtuals: true });
CardSchema.set("toJSON", { virtuals: true });

CardSchema.virtual("likeCount").get(function () {
  if (this.likes) {
    return this.likes.length;
  }
});

const Comment = mongoose.model("Comment", CommentSchema);
const Cards = mongoose.model("Card", CardSchema);
module.exports = Cards;
