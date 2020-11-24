const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);


function getFriendsIds() {
  return new Promise((resolve, reject) => {
    T.get(
      "friends/ids",
      { screen_name: "doggos4all" },
      function (error, data, response) {
        let validIds = data.ids.filter((id) => {
          return id.toString().length < 15;
        });
        if(validIds) {
          resolve(validIds)
        } else {
          reject(Error(error))
        }
      }
    );
  })
}

function compareUsers(usersIds) {
  return new Promise((resolve, reject) => {
    T.get(
      "friendships/lookup",
      { screen_name: "doggos4all", user_id: usersIds },
      function (error, data, response) {
        if(data) {
          resolve(data)
        } else {
          reject(Error("Error: ", error))
        }
      }
    );
  })

}

function unfollowUser(userId) {
  T.post(
    "friendships/destroy",
    {
      user_id: userId,
    },
    function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    }
  );
}

function recursiveUnfollow(value, users, index) {
  if(value > 0 && users[index]) {
    if(users[index].connections.length == 1 && users[index].screen_name != "doggos4all") {
      unfollowUser(users[index].id);
      return recursiveUnfollow(value - 1, users, index - 1);
    } else {
      return recursiveUnfollow(value, users, index - 1);
    }
  } else {
    return "We have either unfollowed the amount specified, or as many as existed"
  }
}

function botUnfollow() {

  getFriendsIds().then(data => {
    let oldestUsers = data.slice(-99);
    compareUsers(oldestUsers).then(comparedUsers => {
      recursiveUnfollow(10, comparedUsers, 99)
    })
  })
}

// function botUnfollow(callback) {
//   T.get(
//     "friends/ids",
//     { screen_name: "doggos4all" },
//     function (error, data, response) {
//       let validIds = data.ids.filter((id) => {
//         return id.toString().length < 15;
//       });
//       let oldestFriends = validIds.slice(-30);
//       T.get(
//         "friendships/lookup",
//         { screen_name: "doggos4all", user_id: oldestFriends },
//         function (error, data, response) {
//           data.forEach(function (follower) {
//             if (
//               follower.connections.length == 1 &&
//               follower.screen_name != "doggos4all"
//             ) {
//               T.post(
//                 "friendships/destroy",
//                 {
//                   user_id: follower.id,
//                 },
//                 function (error, response) {
//                   if (error) {
//                     console.log(error);
//                   } else {
//                     console.log(response);
//                   }
//                 }
//               );
//             }
//           });
//           callback(null, data);
//         }
//       );
//     }
//   );
// }

module.exports = {
  botUnfollow,
};
