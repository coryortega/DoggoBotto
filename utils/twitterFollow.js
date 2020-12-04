const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);

const { searchUsers } = require('./functions.js');

function twitterFollow() {
  searchUsers().then((response) => {
    console.log(response)
  }).catch((error) => {
    console.log(error)
  })
}


// let userNames = {};

// module.exports = {
//   botSearch: function () {
//     T.get("search/tweets", { q: "#dog" }, function (error, tweets, response) {
//       tweets.statuses.forEach(function (tweet) {
//         userNames[tweet.user.name] = tweet.user.id;
//         console.log(userNames);
//       });
//     });
//   },

//   botFollow: function () {
//     for (let i = 0; i < 8; i++) {
//       T.post(
//         "friendships/create",
//         {
//           Name: Object.keys(userNames)[i],
//           user_id: userNames[Object.keys(userNames)[i]],
//         },
//         function (error, response) {
//           if (error) {
//             console.log(error, userNames[i]);
//           } else {
//             console.log(response, i);
//             userNames = {};
//           }
//         }
//       );
//     }
//   },
// };

// module.exports.userNames = userNames;

module.exports = {
  twitterFollow,
};
