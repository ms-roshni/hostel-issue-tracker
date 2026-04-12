const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  usn: {
    type: String,
    required: true,
    unique: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["student", "warden"],
    default: "student",
  },

  roomNumber: String,
  floor: Number,
});

module.exports = mongoose.model("User", userSchema);