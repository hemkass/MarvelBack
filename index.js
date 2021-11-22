require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(formidable());

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome on my Marvel App" });
});

const UserRoutes = require("./routes/users");
app.use(UserRoutes);

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);

const bookmarksRoutes = require("./routes/bookmarks");
app.use(bookmarksRoutes);

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

app.all("*", (req, res) => {
  res.json("All routes");
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
