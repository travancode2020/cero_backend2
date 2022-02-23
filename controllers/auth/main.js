const admin = require("firebase-admin");
const User = require("../../modals/User.js");

const sessionLogin = async (req, res, next) => {
  const idToken = req.body.idToken.toString();
  const notificationToken = req.body.notificationToken;
  const email = req.body.email;
  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 20 days expiry

  await User.findOneAndUpdate(
    { email: email },
    { notificationToken: notificationToken }
  );

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        next(error);
      }
    );
};
const sessionLogout = (req, res, next) => {
  res.clearCookie("session");
  res.status(200).end();
};

module.exports = {
  sessionLogin,
  sessionLogout,
};
