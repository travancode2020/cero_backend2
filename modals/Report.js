const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
    problem: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
