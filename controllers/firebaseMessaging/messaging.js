const admin = require("firebase-admin");
const User = require("../../modals/User");
const { sendFirebaseNotification } = require("../fireBaseNotification/main");

const messageNotification = async () => {
  try {
    const message = admin
      .firestore()
      .collection("chat_rooms")
      .orderBy("last_ts", "desc")
      .limit(1);

    message.onSnapshot(async (snapshot) => {
      let latestMessage = snapshot.docs[0].data();
      if (latestMessage && !latestMessage.typing) {
        let receiver_id = latestMessage.receive_by;
        let sendBy = latestMessage.last_send_by;

        let receiverData = await User.findOne({ _id: receiver_id });
        let notificationData = {};
        if (receiverData && receiverData.notificationToken) {
          await sendFirebaseNotification(
            "cero",
            `Message from ${sendBy}`,
            notificationData,
            receiverData.notificationToken
          );
        }
      }
    });
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = { messageNotification };
