const express = require("express");
const router = express.Router();

const { getDoggoOTD } = require("../utils/functions.js");
const { uploadDoggo, uploadUserDoggo } = require("../utils/twitterPost.js");
const { twitterFollow } = require("../utils/twitterFollow.js");
const { twitterUnfollow } = require("../utils/twitterUnfollow.js");

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
      res.send("User submitted Doggo");
    }
  });
});

router.get("/follow", function (req, res) {
  twitterFollow();
  res.send("Following up to 15 users...");
});

router.get("/unfollow", function (req, res) {
  twitterUnfollow();
  res.send("Unfollowed 10 users...");
});

module.exports = router;
