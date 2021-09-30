const express = require("express");

const {
  getAllLocations,
  deleteAllLocations,
} = require("../controllers/location/main.js");

const LocationRouter = express.Router();

//controllers/location/main.js
LocationRouter.get("/", getAllLocations);
LocationRouter.delete("/", deleteAllLocations);

module.exports = LocationRouter;
