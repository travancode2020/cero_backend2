const Users = require("../../modals/User.js");

const getFollowerByFollowerId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.followers.id(req.params.followerId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.followers.id(req.params.followerId));
        } else if (card == null) {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.followerId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteFollowerByFollowerId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.followers.id(req.params.followerId) != null) {
          card.followers.id(req.params.followerId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.followers);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.followerId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getFollowerByFollowerId,
  deleteFollowerByFollowerId,
};
