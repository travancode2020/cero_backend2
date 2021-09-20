const Users = require("../../modals/User.js");

const getFollowersByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (user) => {
        if (user != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user.followers);
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

const postFollowersByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          card.followers.push(req.body);
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.followers);
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

const deleteFollowersByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          for (var i = card.followers.length - 1; i >= 0; i--) {
            card.followers.id(card.followers[i]._id).remove();
          }
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.followers);
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
  getFollowersByUserId,
  postFollowersByUserId,
  deleteFollowersByUserId,
};
