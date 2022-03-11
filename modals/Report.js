const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    reportedBy: {
      type: String,
      required: true,
    },
    contentId: {
      type: String,
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
