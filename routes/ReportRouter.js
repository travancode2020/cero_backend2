const express = require("express");
const {
  report,
  getReport,
  changeReportStatus,
} = require("../controllers/report/main");

const ReportRouter = express.Router();

ReportRouter.post("/saveReport", report);
ReportRouter.get("/getReport", getReport);
ReportRouter.put("/changeReportStatus", changeReportStatus);

module.exports = ReportRouter;
