const admin = require("firebase-admin");

const sessionLogin = (req, res, next) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 20 * 1000; // 20 days expiry

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
