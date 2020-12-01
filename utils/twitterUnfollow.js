const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);

const { getFriendsIds, compareUsers, unfollowUser } = require('./functions.js');

// ************** note: recursiveUnfollow is entirely unnecessary for this. The iterative approach at the bottom would make more sense.*****************

// value = the number of users were gonna unfollower
// users = users json
// index = points to the user we're on
// sliceIndex = the index indicating the point of users we're going to check

function recursiveUnfollow(value, users, index, sliceIndex) {
  if(value > 0 && users[index]) {
    if(users[index].connections.length == 1 && users[index].screen_name != "doggos4all") {
      unfollowUser(users[index].id);
      return recursiveUnfollow(value - 1, users, index - 1, sliceIndex);
    } else {
      return recursiveUnfollow(value, users, index - 1, sliceIndex);
    }
  } else if(value == 10) {
      let oldestUsers = data.slice(sliceIndex, sliceIndex + 99);
      compareUsers(oldestUsers).then(comparedUsers => {
        recursiveUnfollow(10, comparedUsers, sliceIndex + 99)
      })
  } else {
    return "We have either unfollowed the amount specified, or as many as existed"
  }
}

// initializer for recursion
function botUnfollow() {
  let startingValue = 10
  getFriendsIds().then(data => {
    let oldestUsersFirst = data.reverse()
    let initialSlice = oldestUsersFirst.slice(0, 99)
    compareUsers(initialSlice).then(comparedUsers => {
      recursiveUnfollow(startingValue , comparedUsers, 99, 99)
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
