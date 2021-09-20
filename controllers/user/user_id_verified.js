const Users = require("../../modals/User.js");

const getVerifiedByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (user) => {
        if (user != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user.verifiedProfiles);
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

const postVerifiedByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          card.verifiedProfiles.push(req.body);
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.verifiedProfiles);
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

const deleteVerifiedByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          for (var i = card.verifiedProfiles.length - 1; i >= 0; i--) {
            card.verifiedProfiles.id(card.verifiedProfiles[i]._id).remove();
          }
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.verifiedProfiles);
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
  getVerifiedByUserId,
  postVerifiedByUserId,
  deleteVerifiedByUserId,
};
