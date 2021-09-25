const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MomentScema = new Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaType: {
    type: String,
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
});

const Moment = mongoose.model("Moment", MomentScema);

module.exports = {
  Moment,
};
