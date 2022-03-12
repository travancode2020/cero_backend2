const Report = require("../../modals/Report");
const { Types } = require("mongoose");

const report = async (req, res, next) => {
  try {
    let { body } = req;
    let reportSaved = await Report.create(body);

    if (!reportSaved) throw new Error("something went wrong while reporting");

    res.json(reportSaved);
  } catch (error) {
    next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    let { id } = req.query;
    filter = {};
    if (id) {
      filter = { ...filter, _id: Types.ObjectId(id) };
    }
    let reportData = await Report.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: "$reportedBy" },
      {
        $project: {
          "reportedBy.name": 1,
          "reportedBy.userName": 1,
          "reportedBy.photoUrl": 1,
          contentId: 1,
          type: 1,
          status: 1,
          problem: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (id) {
      reportData = reportData[0];
    }

    res.json(reportData);
  } catch (error) {
    next(error);
  }
};

const changeReportStatus = async (req, res, next) => {
  try {
    let { body } = req;
    let { id, status } = body;

    if (!id) throw new Error("Please pass report id");
    let reportUpdated = await Report.findOneAndUpdate(
      { _id: id },
      { status: status }
    );

    if (!reportUpdated) throw new Error("something went wrong while reporting");
    let reportData = await Report.aggregate([
      { $match: { _id: Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedBy",
        },
      },
      { $unwind: "$reportedBy" },
      {
        $project: {
          "reportedBy.name": 1,
          "reportedBy.userName": 1,
          "reportedBy.photoUrl": 1,
          contentId: 1,
          type: 1,
          status: 1,
          problem: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    res.json(reportData[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { report, getReport, changeReportStatus };
