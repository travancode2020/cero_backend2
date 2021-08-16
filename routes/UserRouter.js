const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Users = require("../modals/User");

const UserRouter = express.Router();

UserRouter.use(bodyParser.json());

UserRouter.route("/")

  .get((req, res, next) => {
    Users.find({})
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Users.create(req.body)
      .then(
        (user) => {
          console.log("New User Created", user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Users");
  })

  .delete((req, res, next) => {
    Users.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .patch((req, res, next) => {
    const userName = req.body.userName;

    Users.find({ userName: userName })
      .then(
        (card) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");

          if (card.length <= 0) {
            res.json(true);
          } else res.json(false);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

UserRouter.route("/:userid")
  .get((req, res, next) => {
    Users.findById(req.params.userid)
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .patch((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userid,
      {
        $addToSet: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userid,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userid,
      {
        $pullAll: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userid)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

UserRouter.route("/:userId/work")
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (card != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(card.work);
          } else {
            err = new Error("Card " + req.params.userId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (card != null) {
            card.work.push(req.body);
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.work);
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
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Cards");
  })
  .delete((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (card != null) {
            for (var i = card.work.length - 1; i >= 0; i--) {
              card.work.id(card.work[i]._id).remove();
            }
            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card);
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
  });

UserRouter.route("/:userId/work/:workId")
  .get((req, res, next) => {
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
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /work/" +
        req.params.workId +
        "/work/" +
        req.params.userId
    );
  })
  .put((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (card != null && card.work.id(req.params.workId) != null) {
            if (req.body.images) {
              card.work.id(req.params.workId).images = req.body.images;
            }
            if (req.body.views) {
              card.work.id(req.params.workId).views = req.body.views;
            }

            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.work);
              },
              (err) => next(err)
            );
          } else if (card == null) {
            err = new Error("Card " + req.params.cardId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .patch((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (card != null && card.work.id(req.params.workId) != null) {
            if (req.body.images) {
              card.work.id(req.params.workId).images = req.body.images;
            }
            if (req.body.views) {
              card.work.id(req.params.workId).views = req.body.views;
            }

            card.save().then(
              (card) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(card.work);
              },
              (err) => next(err)
            );
          } else if (card == null) {
            err = new Error("Card " + req.params.cardId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
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
  });

UserRouter.route("/:userId/followers")
  .get((req, res, next) => {
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
  })

  .post((req, res, next) => {
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
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /followers");
  })
  .delete((req, res, next) => {
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
  });

UserRouter.route("/:userId/followers/:followerId")
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (
            card != null &&
            card.followers.id(req.params.followerId) != null
          ) {
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
  })
  .delete((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (
            card != null &&
            card.followers.id(req.params.followerId) != null
          ) {
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
  });

UserRouter.route("/:userId/verifiedprofiles")
  .get((req, res, next) => {
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
  })

  .post((req, res, next) => {
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
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /verified profiles");
  })
  .delete((req, res, next) => {
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
  });

UserRouter.route("/:userId/verifiedprofiles/:verifiedId")
  .get((req, res, next) => {
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
  })
  .delete((req, res, next) => {
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
  });

UserRouter.route("/:userId/following")
  .get((req, res, next) => {
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
  })

  .post((req, res, next) => {
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
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /following");
  })
  .delete((req, res, next) => {
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
  });

UserRouter.route("/:userId/following/:followingId")
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (
            card != null &&
            card.following.id(req.params.followingId) != null
          ) {
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
  })
  .delete((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (card) => {
          if (
            card != null &&
            card.following.id(req.params.followingId) != null
          ) {
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
  });

//saved left

module.exports = UserRouter;
