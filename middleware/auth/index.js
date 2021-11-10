const admin = require("firebase-admin");

const checkAuth = (req, res, next) => {
  const sessionCookie = req.cookies.session || "";
  console.log(sessionCookie);
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      console.log(decodedClaims);
      next();
    })
    .catch((error) => {
      res.status(401).json({ message: "Unauthorized" });
    });
};

module.exports = {
  checkAuth,
};
