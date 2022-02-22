const Interest = require("../../modals/Interest");
const addRemoveInterest = async (req, res, next) => {
  try {
    let { interest, key, id } = req.body;
    if (key != "ceroapp8080") throw new Error("Somthing went wrong");
    if (interest && interest.length > 0) {
      interest = interest.map((obj) => {
        return {
          interest: obj,
        };
      });

      let interestSaved = await Interest.insertMany(interest);
      interestSaved &&
        res.status(200).send({ message: "Interest added successfully" });
    } else if (id) {
      let deleteInterest = await Interest.deleteOne({ _id: id });
      deleteInterest &&
        res.status(200).send({ message: "Interest deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const getInterest = async (req, res) => {
  let { id } = req.query;
  let filter = {};
  if (id) {
    filter = { ...filter, _id: id };
  }
  let ineterest = await Interest.find(filter).select("interest");
  ineterest && res.status(200).send(ineterest);
};

module.exports = { addRemoveInterest, getInterest };
