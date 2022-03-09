const Users = require("../../modals/User.js");

const getWorkByUserId = (req, res, next) => {
  let { page, limit } = req.query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 20;
  let skip = (page - 1) * limit;
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          card.work = card.work.reverse();
          let work = card.work.slice(skip, skip + limit);
          let totalPages = Math.ceil(card.work.length / limit);
          res.json({ totalPages, data: work });
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

const postWorkByUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then(
      (card) => {
        if (card != null) {
          card.work.push(req.body);
          card.save().then(
            (card) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(card.work[card.work.length - 1]);
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

const deleteWorkByUserId = (req, res, next) => {
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
};

module.exports = {
  getWorkByUserId,
  postWorkByUserId,
  deleteWorkByUserId,
};
