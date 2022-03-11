const Report = require("../../modals/Report");

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

module.exports = { report };
