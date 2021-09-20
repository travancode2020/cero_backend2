const Users = require("../../modals/User.js");

const getUserByUserId = (req, res, next) => {
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
};

const postUserByUserId = (req, res, next) => {
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
};

const patchUserByUserId = (req, res, next) => {
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
};

const putUserByUserId = (req, res, next) => {
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
};

const deleteUserByUserId = (req, res, next) => {
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
};

module.exports = {
  getUserByUserId,
  postUserByUserId,
  patchUserByUserId,
  putUserByUserId,
  deleteUserByUserId,
};
