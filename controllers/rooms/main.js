const Rooms = require("../../modals/Room");
const { Types } = require("mongoose");
const moment = require("moment");
const addRooms = async (req, res, next) => {
  try {
    let { body } = req;
    let { _id } = body;
    if (!body) throw new Error("Please Enter valid Details");
    let roomUpdated;
    let roomsaved;

    roomsaved = await Rooms.create(body);
    if (!roomsaved) throw new Error("Something went wrong while creating room");

    roomsaved &&
      res
        .status(200)
        .json({ success: true, message: "Room created succesfully" });
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
            { name: { $regex: nameFilter } },
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
            { name: { $regex: nameFilter } },
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

    let rooms = await Rooms.find({ hostId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (!rooms) throw new Error("Rooms not found");

    let count = await Rooms.find({ hostId });
    let totalPages = Math.ceil(count.length / limit);

    rooms && res.status(200).json({ succes: true, totalPages, data: rooms });
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
    console.log(_id, userId);

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
  let { id, page, limit } = req.query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 20;
  let skip = (page - 1) * limit;

  let timeNow = new Date(moment().format("YYYY-MM-DD HH:MM"));
  let afterOneHour = new Date(
    moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
  );
  let rooms = await Rooms.find({
    $and: [
      { dateAndTime: { $gte: timeNow } },
      { dateAndTime: { $lte: afterOneHour } },
      {
        $or: [
          { isPrivate: false },
          {
            $and: [{ isPrivate: true }, { inviteOrScheduledUser: { $in: id } }],
          },
        ],
      },
    ],
  });
  let roomsdata = rooms.slice(skip, skip + limit);
  let totalPages = Math.ceil(rooms.length / limit);
  rooms && res.status(200).json({ totalPages, data: roomsdata });
  try {
  } catch (error) {
    next(error);
  }
};

const getScheduledRoom = async (req, res, next) => {
  let { id, page, limit } = req.query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 20;
  let skip = (page - 1) * limit;

  let timeNow = new Date(moment().format("YYYY-MM-DD HH:MM"));
  let afterOneHour = new Date(
    moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
  );
  let rooms = await Rooms.find({
    $and: [
      { dateAndTime: { $gte: afterOneHour } },
      {
        $or: [
          {
            $and: [{ isPrivate: true }, { inviteOrScheduledUser: { $in: id } }],
          },
        ],
      },
    ],
  });
  let roomsdata = rooms.slice(skip, skip + limit);
  let totalPages = Math.ceil(rooms.length / limit);
  rooms && res.status(200).json({ totalPages, data: roomsdata });
  try {
  } catch (error) {
    next(error);
  }
};

const getUpcommingRoom = async (req, res, next) => {
  let { id, page, limit } = req.query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 20;
  let skip = (page - 1) * limit;

  let timeNow = new Date(moment().format("YYYY-MM-DD HH:MM"));
  let afterOneHour = new Date(
    moment().add(1, "hours").format("YYYY-MM-DD HH:MM")
  );
  let rooms = await Rooms.find({
    $and: [
      { dateAndTime: { $gte: afterOneHour } },
      {
        $or: [
          {
            $and: [{ isPrivate: true }, { inviteOrScheduledUser: { $ne: id } }],
          },
        ],
      },
    ],
  });
  let roomsdata = rooms.slice(skip, skip + limit);
  let totalPages = Math.ceil(rooms.length / limit);
  rooms && res.status(200).json({ totalPages, data: roomsdata });
  try {
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
};
