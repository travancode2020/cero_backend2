const Users = require("../../modals/User.js");

const getAllUsers = (req, res, next) => {
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
};

const createUser = (req, res, next) => {
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
};

const patchUserByUsername = (req, res, next) => {
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
};

const deleteAllUsers = (req, res, next) => {
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
};

module.exports = {
  getAllUsers,
  createUser,
  patchUserByUsername,
  deleteAllUsers,
};
