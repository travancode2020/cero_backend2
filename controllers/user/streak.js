const Users = require("../../modals/User.js");

const getStreakByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const foundUser = await Users.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser.streak);
  } catch (error) {
    next(error);
  }
};

const createStreakByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const lastDate = req.body.lastDate;
    const score = req.body.score;
    const highestScore = req.body.highestScore;

    if (lastDate === null || score === null || highestScore === null) {
      return res
        .status(400)
        .json({ message: "Some body parameters are missing" });
    }

    const newStreak = {
      lastDate,
      score,
      highestScore,
    };

    const foundUser = await Users.findByIdAndUpdate(
      userId,
      {
        $set: { streak: newStreak },
      },
      { new: true }
    );

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

const deleteStreakByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const isUserExists = await Users.exists({ _id: userId });
    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    await Users.findByIdAndUpdate(userId, {
      $unset: { streak: "" },
    });

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const updateStreakByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const newStreakBody = req.body;

    const foundUser = await Users.findByIdAndUpdate(
      userId,
      { streak: newStreakBody },
      { new: true }
    );

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStreakByUserId,
  createStreakByUserId,
  deleteStreakByUserId,
  updateStreakByUserId
};
