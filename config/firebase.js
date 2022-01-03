const admin = require("firebase-admin");
const serviceAccount = require("../cero-5c945-firebase-adminsdk-yrtzn-0b7cd41441.json");

const initFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { initFirebase, admin };
