const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);

const { searchUsers, followUser } = require('./functions.js');

function twitterFollow() {
  searchUsers().then((idSet) => {
    idSet.forEach((id) => {
      followUser(id);
    })
  }).catch((error) => {
    console.log(error)
  })
}


module.exports = {
  twitterFollow,
};
