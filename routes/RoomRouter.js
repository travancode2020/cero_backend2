const express = require("express");
const {
  addRooms,
  getRoomsByUserId,
  getRoomByHost,
  deleteRoom,
  UpdateRoom,
} = require("../controllers/rooms/main");

const RoomRouter = express.Router();

RoomRouter.post("/", addRooms);
RoomRouter.get("/:userId", getRoomsByUserId);
RoomRouter.get("/host/:hostId", getRoomByHost);
RoomRouter.delete("/", deleteRoom);
RoomRouter.put("/", UpdateRoom);

module.exports = RoomRouter;
