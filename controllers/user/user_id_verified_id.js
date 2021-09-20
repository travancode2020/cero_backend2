const Users = require("../../modals/User.js");

const getVerifiedByVerifiedId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (
          card != null &&
          card.verifiedProfiles.id(req.params.verifiedId) != null
        ) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(card.verifiedProfiles.id(req.params.verifiedId));
        } else if (card == null) {
          err = new Error("Card " + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.verifiedId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

const deleteVerifiedByVerifiedId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (
          card != null &&
          card.verifiedProfiles.id(req.params.verifiedId) != null
        ) {
          card.verifiedProfiles.id(req.params.verifiedId).remove();
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.verifiedProfiles);
            },
            (err) => next(err)
          );
        } else if (card == null) {
          err = new Error("CARD" + req.params.userId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error(
            "verified profile " + req.params.verifiedId + " not found"
          );
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = {
  getVerifiedByVerifiedId,
  deleteVerifiedByVerifiedId,
};
