const Rooms = require("../../modals/Room.js");
const { Types } = require("mongoose");
const moment = require("moment");
const {
  sendFirebaseNotification,
  saveNotification,
} = require("../fireBaseNotification/main");
const User = require("../../modals/User.js");

const addRooms = async (req, res, next) => {
  try {
    let { body } = req;
    let { _id } = body;
    if (!body) throw new Error("Please Enter valid Details");
    let roomsaved;
    let validHost = await User.findOne({
      _id: body.hostId,
    });
    if (!validHost) throw new Error("Please enter valid host id");
    roomsaved = await Rooms.create(body);
    if (!roomsaved) throw new Error("Something went wrong while creating room");
    let RoomData = await Rooms.aggregate([
      { $match: { _id: Types.ObjectId(roomsaved._id) } },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    let data = RoomData[0];
    let inviteOrScheduledUsers = data.specialGuest.concat(
      data.inviteOrScheduledUser
    );
    let notificationUsers = await User.find({
      _id: { $in: inviteOrScheduledUsers },
    });

    let startTime = new Date();
    let endTime = new Date();
    let roomTime = new Date(body.dateAndTime);
    startTime.setHours(startTime.getHours() - 1);
    endTime.setHours(endTime.getHours() + 1);
    let notificationData = {};

    if (roomTime > startTime && endTime > roomTime) {
      notificationData = { _id: data._id.toString() };
    }
    for (let userObj of notificationUsers) {
      if (userObj._id != data.hostData._id) {
        let notificationToken = userObj.notificationToken;
        await sendFirebaseNotification(
          "cero",
          `${data.hostData.userName} invite you to a Room`,
          notificationData,
          notificationToken
        );
        await saveNotification(userObj._id, {
          type: 4,
          notification: `${data.hostData.userName} invite you to a Room`,
          action_id: data._id.toString(),
          triggered_by: data.hostData._id,
          createdAt: new Date(),
        });
      }
    }
    roomsaved && res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getRoomsByUserId = async (req, res, next) => {
  try {
    let { userId } = req.params;
    let { page, limit, nameFilter } = req.query;
    nameFilter = nameFilter ? nameFilter : "";
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    if (!userId) throw new Error("Please pass userId");

    let rooms = await Rooms.aggregate([
      {
        $match: {
          $and: [
            { name: { $regex: nameFilter, $options: "i" } },
            {
              $or: [
                { isPrivate: false },
                {
                  isPrivate: true,
                  inviteOrScheduledUser: { $in: [Types.ObjectId(userId)] },
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          _id: 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          description: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
        },
      },
      {
        $sort: { dateAndTime: 1 },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    let count = await Rooms.aggregate([
      {
        $match: {
          $and: [
            { name: { $regex: nameFilter, $options: "i" } },
            {
              $or: [
                { isPrivate: false },
                {
                  isPrivate: true,
                  inviteOrScheduledUser: { $in: [Types.ObjectId(userId)] },
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      {
        $project: {
          _id: 1,
          specialGuest: 1,
          inviteOrScheduledUser: 1,
          name: 1,
          description: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
        },
      },
    ]);
    let totalPages = Math.ceil(count.length / limit);

    rooms && res.status(200).json({ succes: true, totalPages, data: rooms });
  } catch (error) {
    next(error);
  }
};

const getRoomByHost = async (req, res, next) => {
  try {
    let { hostId } = req.params;
    let { page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    if (!hostId) throw new Error("Please pass host id");

    let rooms = await Rooms.aggregate([
      {
        $match: {
          hostId: Types.ObjectId(hostId),
          dateAndTime: { $gte: new Date() },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
        },
      },
      { $sort: { dateAndTime: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    let rooms1 = await Rooms.aggregate([
      {
        $match: {
          hostId: Types.ObjectId(hostId),
          dateAndTime: { $lt: new Date() },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          _id: 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          description: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { dateAndTime: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    let data1 = rooms.concat(rooms1);
    if (!data1) throw new Error("Rooms not found");

    let data = data1.slice(skip, skip + limit);
    let totalPages = Math.ceil(data1.length / limit);

    rooms && res.status(200).json({ totalPages, data: data });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    let { roomId, userId } = req.query;

    let userHaseRoom = await Rooms.findOne({ _id: roomId, hostId: userId });
    if (!userHaseRoom) throw new Error("Invalid RoomId or UserId");

    let roomDeleted = await Rooms.deleteOne({ _id: roomId });
    if (!roomDeleted)
      throw new Error("Something went wrong while deleting Room");

    roomDeleted &&
      res
        .status(200)
        .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const UpdateRoom = async (req, res, next) => {
  try {
    let { _id, userId } = req.body;

    let UserHasRoom = await Rooms.findOne({ _id, hostId: userId });
    if (!UserHasRoom) throw new Error("User room not found");

    let roomUpdated = await Rooms.findOneAndUpdate({ _id }, req.body);
    if (!roomUpdated)
      throw new Error("Something went wrong while creating room");

    roomUpdated &&
      res
        .status(200)
        .json({ success: true, message: "Room updated succesfully" });
  } catch (error) {
    next(error);
  }
};

const getLiveRooms = async (req, res, next) => {
  try {
    let { id, page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(startTime.getHours() - 1);
    endTime.setHours(endTime.getHours() + 1);

    let filter = {
      $and: [
        { dateAndTime: { $gte: startTime } },
        { dateAndTime: { $lte: endTime } },
        {
          $or: [
            { isPrivate: false },
            {
              $and: [
                { isPrivate: true },
                {
                  $or: [
                    { inviteOrScheduledUser: { $in: [Types.ObjectId(id)] } },
                    { specialGuest: { $in: [Types.ObjectId(id)] } },
                    { hostId: { $in: [Types.ObjectId(id)] } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    let rooms = await Rooms.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          description: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    let roomsdata = rooms.slice(skip, skip + limit);
    let totalPages = Math.ceil(rooms.length / limit);
    rooms && res.status(200).json({ totalPages, data: roomsdata });
  } catch (error) {
    next(error);
  }
};

const getScheduledRoom = async (req, res, next) => {
  try {
    let { id, page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let timeNow = new Date(moment().format("YYYY-MM-DD HH:MM"));
    let afterOneHour = new Date(
      moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
    );
    let filter = {
      $and: [
        { dateAndTime: { $gte: afterOneHour } },
        {
          $or: [
            {
              isPrivate: false,
              $or: [
                { inviteOrScheduledUser: { $in: [Types.ObjectId(id)] } },
                { specialGuest: { $in: [Types.ObjectId(id)] } },
                { hostId: { $in: [Types.ObjectId(id)] } },
              ],
            },
            {
              isPrivate: true,
              $or: [
                { inviteOrScheduledUser: { $in: [Types.ObjectId(id)] } },
                { specialGuest: { $in: [Types.ObjectId(id)] } },
                { hostId: { $in: [Types.ObjectId(id)] } },
              ],
            },
          ],
        },
      ],
    };
    let rooms = await Rooms.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.photoUrl": 1,
          "specialGuest.name": 1,

          inviteOrScheduledUser: 1,
          name: 1,
          description: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    let roomsdata = rooms.slice(skip, skip + limit);
    let totalPages = Math.ceil(rooms.length / limit);
    rooms && res.status(200).json({ totalPages, data: roomsdata });
  } catch (error) {
    next(error);
  }
};

const getUpcommingRoom = async (req, res, next) => {
  try {
    let { id, page, limit } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;

    let timeNow = new Date(moment().format("YYYY-MM-DD HH:MM"));
    let afterOneHour = new Date(
      moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
    );
    let filter = {
      dateAndTime: { $gte: afterOneHour },
      isPrivate: false,
      inviteOrScheduledUser: { $ne: Types.ObjectId(id) },
      specialGuest: { $ne: Types.ObjectId(id) },
      hostId: { $ne: Types.ObjectId(id) },
    };
    let rooms = await Rooms.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          description: 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          dateAndTime: 1,
          isPrivate: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    let roomsdata = rooms.slice(skip, skip + limit);
    let totalPages = Math.ceil(rooms.length / limit);
    rooms && res.status(200).json({ totalPages, data: roomsdata });
  } catch (error) {
    next(error);
  }
};

const addInvitedUser = async (req, res, next) => {
  try {
    let { roomId, userId } = req.params;
    let roomData = await Rooms.findOne({ _id: roomId });
    if (!roomData.inviteOrScheduledUser.includes(userId)) {
      roomData.inviteOrScheduledUser.push(userId);
    }

    let saveRoomsData = await Rooms.findOneAndUpdate({ _id: roomId }, roomData);

    saveRoomsData && res.status(200).json(roomData);
  } catch (error) {
    next(error);
  }
};

const cancelInvitedUser = async (req, res, next) => {
  try {
    let { roomId, userId } = req.params;
    let roomData = await Rooms.findOne({ _id: roomId });
    roomData.inviteOrScheduledUser = roomData.inviteOrScheduledUser.filter(
      (userIdObj) => {
        if (userIdObj != userId) {
          return userIdObj;
        }
      }
    );

    let saveRoomsData = await Rooms.findOneAndUpdate({ _id: roomId }, roomData);

    saveRoomsData && res.status(200).json(roomData);
  } catch (error) {
    next(error);
  }
};

const addSpecialGuest = async (req, res, next) => {
  try {
    let { roomId, userId } = req.params;
    let roomData = await Rooms.findOne({ _id: roomId });
    if (!roomData.specialGuest.includes(userId)) {
      roomData.specialGuest.push(userId);
    }

    let saveRoomsData = await Rooms.findOneAndUpdate({ _id: roomId }, roomData);

    saveRoomsData && res.status(200).json(roomData);
  } catch (error) {
    next(error);
  }
};

const removeSpecialGuest = async (req, res, next) => {
  try {
    let { roomId, userId } = req.params;
    let roomData = await Rooms.findOne({ _id: roomId });
    roomData.specialGuest = roomData.specialGuest.filter((userIdObj) => {
      if (userIdObj != userId) {
        return userIdObj;
      }
    });

    let saveRoomsData = await Rooms.findOneAndUpdate({ _id: roomId }, roomData);

    saveRoomsData && res.status(200).json(roomData);
  } catch (error) {
    next(error);
  }
};

const searchRoom = async (req, res, next) => {
  try {
    let { roomseaarch, page, limit, id } = req.query;
    if (!id) throw new Error("Please pass id");
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 20;
    let skip = (page - 1) * limit;
    let startTime = new Date();
    let endTime = new Date();
    startTime.setHours(startTime.getHours() - 1);
    endTime.setHours(endTime.getHours() + 1);
    let afterOneHour = new Date(
      moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
    );
    let roomData = await Rooms.aggregate([
      {
        $match: {
          dateAndTime: { $gte: startTime },
          $or: [
            { isPrivate: false },
            {
              isPrivate: true,
              $or: [
                { inviteOrScheduledUser: { $in: [Types.ObjectId(id)] } },
                { specialGuest: { $in: [Types.ObjectId(id)] } },
                { hostId: { $in: [Types.ObjectId(id)] } },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "specialGuest",
          foreignField: "_id",
          as: "specialGuest",
        },
      },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          "specialGuest._id": 1,
          "specialGuest.userName": 1,
          "specialGuest.name": 1,
          "specialGuest.photoUrl": 1,
          inviteOrScheduledUser: 1,
          name: 1,
          dateAndTime: 1,
          isPrivate: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $unwind: "$hostData",
      },
      {
        $match: {
          $or: [
            {
              name: { $regex: `^${roomseaarch}`, $options: "i" },
            },
            {
              "hostData.name": { $regex: `^${roomseaarch}`, $options: "i" },
            },
            {
              "hostData.userName": { $regex: `^${roomseaarch}`, $options: "i" },
            },
            {
              "hostData.name": { $regex: ` ${roomseaarch}`, $options: "i" },
            },
          ],
        },
      },
    ]);
    let data = roomData.slice(skip, skip + limit);
    data = data.map((obj) => {
      let specialGuest = [];
      let inviteOrScheduledUser = [];
      obj.specialGuest.map((obj1) => {
        specialGuest.push(obj1._id.toString());
      });
      obj.inviteOrScheduledUser.map((obj2) => {
        inviteOrScheduledUser.push(obj2.toString());
      });
      if (
        obj.dateAndTime >= startTime &&
        obj.dateAndTime <= endTime &&
        (obj.isPrivate == false ||
          (obj.isPrivate == true &&
            (inviteOrScheduledUser.includes(id) ||
              specialGuest.includes(id) ||
              obj.hostData._id == id)))
      ) {
        obj = { ...obj, type: 1 };
      } else if (
        obj.dateAndTime >= afterOneHour &&
        ((obj.isPrivate == false &&
          (inviteOrScheduledUser.includes(id) ||
            specialGuest.includes(id) ||
            obj.hostData._id == id)) ||
          (obj.isPrivate == true &&
            (inviteOrScheduledUser.includes(id) ||
              specialGuest.includes(id) ||
              obj.hostData._id == id)))
      ) {
        obj = { ...obj, type: 2 };
      } else if (
        obj.dateAndTime >= afterOneHour &&
        obj.isPrivate == false &&
        !inviteOrScheduledUser.includes(id) &&
        !specialGuest.includes(id) &&
        obj.hostData._id != id
      ) {
        obj = { ...obj, type: 3 };
      } else {
        obj = { ...obj, type: 0 };
      }
      return obj;
    });
    let totalPages = Math.ceil(roomData.length / limit);
    roomData && res.status(200).json({ totalPages, data });
  } catch (error) {
    next(error);
  }
};

const getRoomsById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) throw new Error("please enter room id");

    let roomData = await Rooms.aggregate([
      { $match: { _id: Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "hostId",
          foreignField: "_id",
          as: "hostData",
        },
      },
      { $unwind: "$hostData" },
      {
        $project: {
          "hostData._id": 1,
          "hostData.userName": 1,
          "hostData.name": 1,
          "hostData.photoUrl": 1,
          inviteOrScheduledUser: 1,
          specialGuest: 1,
          name: 1,
          dateAndTime: 1,
          isPrivate: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!roomData) throw new Error("room not found");

    res.status(200).json(roomData[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRooms,
  getRoomsByUserId,
  getRoomByHost,
  deleteRoom,
  UpdateRoom,
  getLiveRooms,
  getScheduledRoom,
  getUpcommingRoom,
  addInvitedUser,
  cancelInvitedUser,
  addSpecialGuest,
  removeSpecialGuest,
  searchRoom,
  getRoomsById,
};
