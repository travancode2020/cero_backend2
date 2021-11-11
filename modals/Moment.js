const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MomentScema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["IMAGE", "VIDEO"],
    required: true,
  },
  mediaUrl: {
    type: [String],
    required: true,
  },
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, expires: "10m" },
});

const Moment = mongoose.model("Moment", MomentScema);

module.exports = {
  Moment,
};
