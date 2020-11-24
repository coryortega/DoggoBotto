const express = require("express");
const router = express.Router();

const { getDoggoOTD } = require('../utils/functions.js');
const { uploadDoggo, uploadUserDoggo } = require('../utils/twitterPost.js');
const { botSearch, botFollow } = require('../utils/twitterSearch.js');
const { botUnfollow } = require('../utils/twitterUnfollow.js');


router.get("/", function (req, res) {
  res.send("Hello, homies!");
});

router.get("/post", function (req, res) {
  res.send("Posting Doggo!"), uploadDoggo();
});

router.get("/doggoOTD", function (req, res) {
  getDoggoOTD().then((response) => {
    console.log(response.status);
    if (response.status === 204) {
      res.send("Non-user submitted Doggo"), uploadDoggo();
    } else {
      uploadUserDoggo(response);
      res.send("yes");
    }
  });
});

router.get("/search", function (req, res) {
  res.send("hi");
  botSearch();
  setTimeout(function () {
    botFollow();
  }, 30000);
});

router.get("/unfollow", function (req, res) {
  botUnfollow()
  res.send("I hope this works")
  // botUnfollow(function(err, value) {
  //   if (err) {
  //     res.send(err)
  //   } else {
  //     res.json(value)
  //   }
  // })
});


module.exports = router;