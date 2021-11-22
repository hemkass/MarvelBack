const SHA256 = require("crypto-js/sha256");
const express = require("express");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

const User = require("../models/User");

// Pour s'inscrire
router.post("/user/signup", async (req, res) => {
  console.log("tape1");
  // on vérifie si l'email n'est pas déjà en base de données
  try {
    const isUser = await User.findOne({ email: req.fields.email });
    if (isUser !== null) {
      res.status(428).json({ message: "Unauthorized" });
    } else {
      console.log("tape2");
      // on encrypte le mot de passe
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);
      console.log(salt);

      // on crée le nouvel utilisateur
      const newUser = new User({
        email: req.fields.email,
        account: {
          username: req.fields.username,
          phone: req.fields.phone,
        },
        token: token,
        hash: hash,
        salt: salt,
      }); //On récupère la photo pour l'avatar;
      if (req.files.picture) {
        let avatarToUpload = req.files.picture.path;

        const result = await cloudinary.uploader.upload(avatarToUpload, {
          public_id: `marvel/users/${newUser._id}`,
          width: 100,
          height: 100,
          gravity: "faces",
          crop: "thumb",
          radius: "max",
        });
        newUser.account.avatar = result.secure_url;
        //S'il n'y en a pas on upload une photo de base
      } else {
        newUser.account.avatar =
          "https: //res.cloudinary.com/dyj84szrx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_mx,bo_5px_solid_red,b_rgb:262c35/v1635089804/vinted/users/blank-profile-picture-973461_1280_uxswkl.png";
      }

      await newUser.save();

      res.status(200).json({
        _id: newUser._id,
        token: newUser.token,
        account: {
          username: newUser.account.username,
          phone: newUser.account.phone,
          avatar: newUser.account.avatar,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// route pour se connecter

router.post("/user/login", async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.fields.email });

    if (isUser) {
      console.log(req.fields.password);
      console.log(isUser.salt);
      const newHash = SHA256(req.fields.password + isUser.salt).toString(
        encBase64
      );
      //console.log("newHash", newHash);
      //console.log("Hash", isUser.hash);
      if (newHash === isUser.hash) {
        //console.log("bon hash");
        res.status(200).json({
          _id: isUser._id,
          token: isUser.token,
          account: {
            username: isUser.account.username,
            phone: isUser.account.phone,
          },
        });
      } else {
        res.status(428).json({ message: "Invalid email or/and password" });
      }
    } else {
      res.status(428).json({ message: "Invalid email or/and password" });
    }
  } catch (error) {}
});

module.exports = router;
