const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", Users);
