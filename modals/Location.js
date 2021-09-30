const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: Array,
      required: true,
    },
  },
});

LocationSchema.index({location: '2dsphere'});


const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;
