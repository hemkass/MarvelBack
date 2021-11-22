const { default: axios } = require("axios");
const mongoose = require("mongoose");
const express = require("express");
const { response } = require("express");
const router = express.Router();

//route 0 : Les compteurs de pages

router.get("/count", async (req, res) => {
  try {
    const responseComics = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL}`
    );
    const responseCaracts = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL}`
    );
    res.status(200).json({
      comicCount: responseComics.data.count,
      caractCount: responseCaracts.data.count,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// route 1 : reucupérer les 100 premiers comics
router.get("/comics", async (req, res) => {
  //console.log("hello");

  let limit = 100;
  let skip = 0;
  if (req.query.skip) {
    skip = req.query.skip;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  let title = "";
  if (req.query.title) {
    title = req.query.title;
  }

  axios
    .get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL}&limit=${limit}&skip=${skip}&title=${title}`
    )
    .then((response) => {
      //console.log(response.data);

      const Comics = response.data.results;

      let FilteredComics = Comics.sort();
      res.json(FilteredComics);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Route 2 : obtenir les comics dans lequel apparait un certain caractère :
router.get("/comics/:characterId", async (req, res) => {
  //console.log("commics");
  let id = req.params.characterId;
  //console.log(id);
  axios
    .get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${id}?apiKey=${process.env.MARVEL}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
