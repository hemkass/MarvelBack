const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

// Route 3 : obtenir tous les persos :
router.get("/characters", async (req, res) => {
  //console.log("par ici");
  let limit = 100;
  let skip = 0;
  if (req.query.skip) {
    skip = req.query.skip;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  let name = "";
  if (req.query.name) {
    name = req.query.name;
  }
  //console.log(req.query.limit, req.query.skip);
  axios
    .get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL}&limit=${limit}&skip=${skip}&name=${name}`
    )
    .then((response) => {
      //console.log("coucou", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

//Route 4 obtenir un caractère par son ID
router.get("/characters/:id", async (req, res) => {
  let id = req.params.id;
  //console.log(id);
  axios
    .get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL}`
    )
    .then((response) => {
      const characters = response.data.results;
      const character = characters.find((elem) => elem._id === id);
      //console.log("bonjour", character);
      res.json(character);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
