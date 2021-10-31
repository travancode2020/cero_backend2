const Users = require("../../modals/User.js");
const mongoose = require("mongoose");

const getWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.work.id(req.params.workId));
        } else if (card == null) {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.workId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const patchWorkByWorkId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const workId = req.params.workId;
    const resourceToUpdate = req.body.resourceToUpdate;
    const newResource = req.body.newResource;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!workId) {
      return res.status(400).json({ message: "workId is required" });
    }

    if (!resourceToUpdate || !newResource) {
      return res
        .status(400)
        .json({ message: "required body parameters are missing" });
    }

    const foundUser = await Users.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const foundWork = foundUser.work.filter((work) => work.id === workId);

    if (!foundWork.length) {
      return res.status(404).json({ message: "Work not found on User" });
    }

    await Users.updateOne(
      { _id: userId, "work._id": workId },
      {
        $set: { [`work.$.${resourceToUpdate}`]: newResource },
      }
    );

    res.status(200).json({ message: "Work updated" });
  } catch (error) {
    next(error);
  }
};

const deleteWorkByWorkId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.work.id(req.params.workId) != null) {
          card.work.id(req.params.workId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.work);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.cardId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.likeid + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getWorkByWorkId,
  patchWorkByWorkId,
  deleteWorkByWorkId,
};
