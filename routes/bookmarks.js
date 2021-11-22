const express = require("express");
const cloudinary = require("cloudinary").v2;
const auth = require("../AUTHmiddleware");
const router = express.Router();

const Bookmark = require("../models/Bookmark");

// enregister un favori en base de donnée
router.post("/comics/bookmarks/add", auth, async (req, res) => {
  try {
    if (req.user) {
      const isBookmarks = await Bookmark.findOne({
        _id: req.fields._id,
      });

      if (isBookmarks) {
        res.status(428).json({ message: "ce favori est déjà enregistré" });
      } else {
        console.log(req.fields.description);
        const newBookmark = new Bookmark({
          description: req.fields.description,
          thumbnail: { path: req.fields.path, extension: req.fields.extension },
          title: req.fields.title,
          _id: req.fields._id,
        });
        await newBookmark.save();
        res.status(200).json({ message: "bien enregistré" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// afficher un favori en base de donnée
router.get("/bookmarks", auth, async (req, res) => {
  console.log("route des favoris");
  try {
    const Bookmarks = await Bookmark.find();

    if (req.user) {
      console.log(Bookmarks);
      res.status(200).json(Bookmarks);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// supprimer un favori en base de donnée
router.post("/bookmarks/delete", auth, async (req, res) => {
  try {
    if (req.user) {
      console.log("mon id", req.fields.id);

      const isBookmark = await Bookmark.findByIdAndDelete({
        _id: req.fields.id,
      });

      if (isOffer)
        return res.json({
          message: `your offer ${isOffer.title} has been deleted`,
        });
      else {
        return res.status(428).json({ error: "No Bookmark found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
