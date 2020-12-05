const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);

const { searchUsers, followUser } = require('./functions.js');

function twitterFollow() {
  searchUsers().then((response) => {
    for(let i = 0; i < 8; i++) {
      followUser(response[i]);
    }
  }).catch((error) => {
    console.log(error)
  })
}


module.exports = {
  twitterFollow,
};
