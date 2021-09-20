const Users = require("../../modals/User.js");

const getFollowingByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (user) => {
        if (user != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user.following);
        } else {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const postFollowingByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          card.following.push(req.body);
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.following);
            },
            (err) => next(err)
          );
        } else {
          err = new Error("Card " + req.params.userid + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteFollowingByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          for (var i = card.following.length - 1; i >= 0; i--) {
            card.following.id(card.following[i]._id).remove();
          }
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.following);
            },
            (err) => next(err)
          );
        } else {
          err = new Error("work " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getFollowingByUserId,
  postFollowingByUserId,
  deleteFollowingByUserId,
};
