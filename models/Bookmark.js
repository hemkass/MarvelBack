const mongoose = require("mongoose");
const Bookmark = mongoose.model("Bookmark", {
  description: String,
  thumbnail: { path: String, extension: String },
  title: String,

  _id: String,
});
module.exports = Bookmark;
