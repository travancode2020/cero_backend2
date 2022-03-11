const express = require("express");
const { report } = require("../controllers/report/main");

const ReportRouter = express.Router();

ReportRouter.post("/saveReport", report);

module.exports = ReportRouter;
