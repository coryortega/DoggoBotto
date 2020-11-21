const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);


function botUnfollow(callback) {

    let followers = [];

    T.get("followers/list", { screen_name: 'doggos4all' }, function (error, data, response) {
    //   data.forEach(function (tweet) {
    //     userNames[tweet.user.name] = tweet.user.id;
    //     console.log(userNames);
    //   });
        callback(null, data)
    });
}

module.exports = {
  botUnfollow
}

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

