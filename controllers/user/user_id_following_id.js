const Users = require("../../modals/User.js");

const getFollowingByFollowingId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.following.id(req.params.followingId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.following.id(req.params.followingId));
        } else if (card == null) {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.followingId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteFollowingByFollowingId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null && card.following.id(req.params.followingId) != null) {
          card.following.id(req.params.followingId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.following);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.followingId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getFollowingByFollowingId,
  deleteFollowingByFollowingId,
};
