const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestSchema = new Schema(
  {
    interest: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Interest = mongoose.model("Interest", InterestSchema);
module.exports = Interest;
