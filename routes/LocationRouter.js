const express = require("express");

const {
  getAllLocations,
  deleteAllLocations,
} = require("../controllers/location/main.js");

const {
  enableLocationSharing,
  updateLocation,
  disableLocationSharing,
} = require("../controllers/location/user_id.js");

const {
  searchByCity,
  searchByRange,
} = require("../controllers/location/search.js");

const LocationRouter = express.Router();

//controllers/location/main.js
LocationRouter.get("/", getAllLocations);
LocationRouter.delete("/", deleteAllLocations);

//controllers/location/user_id.js
LocationRouter.post("/:userId", enableLocationSharing);
LocationRouter.post("/disable/:userId", disableLocationSharing);
LocationRouter.put("/:userId", updateLocation);

//controllers/location/search.js
LocationRouter.get("/search/range", searchByRange);
LocationRouter.get("/search/city", searchByCity);

module.exports = LocationRouter;
