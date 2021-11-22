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

const getUserByPhno = (req, res, next) => {
    Users.findOne({"phone":req.params.phno})
    .then(
      (resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
      },
      (err)=> next(err)
    )
    .catch((err) => next(err));
};


const checkUsernameExists = async (req, res, next) => {
  try {
    const userName = req.body.userName;

    if (!userName) {
      res.status(400).json({ message: "userName is required" });
    }

    const foundUser = await Users.findOne({ userName });

    if (foundUser) {
      return res
        .status(200)
        .json({ message: "User name is not available", isAvailable: false });
    }

    res
      .status(200)
      .json({ message: "User name is available", isAvailable: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  patchUserByUsername,
  deleteAllUsers,
  checkUsernameExists,
  getUserByPhno
};
