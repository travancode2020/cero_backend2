const Users = require("../../modals/User.js");
const admin = require("firebase-admin");

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

const createUser = async (req, res, next) => {
  try {
    if (req.body.phone) {
      let phoneNumberAvailable = await Users.findOne({ phone: req.body.phone });
      if (phoneNumberAvailable)
        throw new Error("Phone number already registered");
    }
    let { idToken } = req.body;
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 20 days expiry

    let agoraId = await generateUniqueAgoraId();
    let body = { ...req.body, agoraId };
    Users.create(body)
      .then(
        (user) => {
          if (idToken) {
            admin
              .auth()
              .createSessionCookie(idToken.toString(), { expiresIn })
              .then(
                (sessionCookie) => {
                  const options = { maxAge: expiresIn, httpOnly: true };
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.cookie("session", sessionCookie, options);
                  res.json(user);
                },
                (error) => {
                  next(error);
                }
              );
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
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
  Users.findOne({ phone: req.params.phno })
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

const generateUniqueAgoraId = async () => {
  try {
    let isUnique = false;
    let uniqueNumber;

    while (isUnique == false) {
      uniqueNumber = Math.floor(000000000 + Math.random() * 999999999);
      let numberExist = await Users.findOne({ agoraId: uniqueNumber });

      if (!numberExist) {
        isUnique = true;
      }
    }

    return uniqueNumber;
  } catch (error) {
    return error;
  }
};

const findUserByNameUserName = async (req, res, next) => {
  try {
    let { userFilter, page, limit } = req.query;
    userFilter = userFilter ? userFilter : "";
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let UserList = await Users.aggregate([
      {
        $match: {
          $or: [
            { userName: { $regex: `^${userFilter}`, $options: "i" } },
            { name: { $regex: `^${userFilter}`, $options: "i" } },
            { name: { $regex: ` ${userFilter}`, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          userName: 1,
          photoUrl: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    let count = await Users.aggregate([
      {
        $match: {
          $or: [
            { userName: { $regex: `^${userFilter}`, $options: "i" } },
            { name: { $regex: `^${userFilter}`, $options: "i" } },
          ],
        },
      },
    ]);

    let totalPages = Math.ceil(count.length / limit);

    UserList && res.status(200).json({ totalPages, data: UserList });
  } catch (error) {
    next(error);
  }
};

const searchByUserNameName = async (req, res, next) => {
  try {
    let { userName, name, page, limit } = req.query;

    let filter = {};
    if (name) {
      filter = {
        ...filter,
        $or: [
          {
            name: {
              $regex: `^${name}`,
              $options: "i",
            },
          },
          {
            name: {
              $regex: ` ${name}`,
              $options: "i",
            },
          },
        ],
      };
    }
    if (userName) {
      filter = {
        ...filter,
        userName: {
          $regex: `^${userName}`,
          $options: "i",
        },
      };
    }

    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let data = await Users.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          following: 0,
          saved: 0,
          liked: 0,
          viewed: 0,
          isLocationSharingEnabled: 0,
          fId: 0,
          email: 0,
          password: 0,
          dob: 0,
          work: 0,
          location: 0,
          agoraId: 0,
          createdAt: 0,
          updatedAt: 0,
          createdAt: 0,
          proBio: 0,
          phone: 0,
        },
      },
    ]);
    let count = data.slice(skip, skip + limit);
    let totalPages = Math.ceil(data.length / limit);

    res.status(200).json({ totalPages, data: count });
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
  getUserByPhno,
  findUserByNameUserName,
  searchByUserNameName,
};
