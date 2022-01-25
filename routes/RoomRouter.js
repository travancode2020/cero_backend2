const express = require("express");
const {
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
} = require("../controllers/rooms/main");

const RoomRouter = express.Router();

RoomRouter.post("/", addRooms);
RoomRouter.get("/liveRooms", getLiveRooms);
RoomRouter.get("/ScheduledRoom", getScheduledRoom);
RoomRouter.get("/upcommingRoom", getUpcommingRoom);
RoomRouter.get("/:userId", getRoomsByUserId);
RoomRouter.get("/host/:hostId", getRoomByHost);
RoomRouter.delete("/", deleteRoom);
RoomRouter.put("/", UpdateRoom);
RoomRouter.post("/:roomId/inviteUser/:userId", addInvitedUser);
RoomRouter.delete("/:roomId/cancelInvite/:userId", cancelInvitedUser);
RoomRouter.post("/:roomId/addGuest/:userId", addSpecialGuest);
RoomRouter.delete("/:roomId/removeGuest/:userId", removeSpecialGuest);

module.exports = RoomRouter;
