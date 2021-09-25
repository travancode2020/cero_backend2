const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MomentScema = new Schema({
  host: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["IMAGE", "VIDEO"],
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "1440m",
  },
});

const Moment = mongoose.model("Moment", MomentScema);

module.exports = {
  Moment,
};
