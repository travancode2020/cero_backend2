const { admin } = require("../config/firebase");

const saveNotificationData = async (body, userId) => {
  admin
    .messaging()
    .sendToDevice(
      "AAAA6l9oSWQ:APA91bFPneTjxO_va34TvyiyndR_J4a8heetjYzW2f9RCRTYqqXuvhJXiNL1JBERTOcPSfGDUvAyW2Luad2vgCvEMc6tHxUtY_ztvJNrAZqW4C4221z3e6VVPGFYfkDBFj5Z56uc8Dzf",
      { notification: { hiii: "hii" } }
    )
    .then((response) => {
      console.log(response.results[0].error);
    })
    .catch((error) => {
      console.log(error);
    });
};

saveNotificationData({ like: "Test Like Your Post" }, 123465);

module.exports = { saveNotificationData };
