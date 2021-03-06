const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MomentScema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isImage: {
    type: Boolean,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: "1440m",
    },
  },
});

const Moment = mongoose.model("Moment", MomentScema);

module.exports = {
  Moment,
};
