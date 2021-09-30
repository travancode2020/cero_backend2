const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [
      {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
      },
    ],
  },
});

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;
