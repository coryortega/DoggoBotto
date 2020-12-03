const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);

const { getFriendsIds, compareUsers, unfollowUser } = require('./functions.js');

// ************** note: recursiveUnfollow is entirely unnecessary for this. The iterative approach at the bottom would make more sense.*****************

// value = the number of users were gonna unfollow
// ids = 5000 ids of users DoggoBotto followers
// users = 99 user objects that represent the relationship between them and DoggoBotto
// sliceIndex = the index indicating the point of users we're going to check

function recursiveUnfollow(value, ids, users, sliceIndex) {
  if(users.length > 0 && value > 0) {
    const currentUser = users.pop();
    if(currentUser.connections.length == 1 && currentUser.screen_name != "doggos4all") {
      unfollowUser(currentUser.id);
      return recursiveUnfollow(value - 1, ids, users, sliceIndex);
    } else {
      return recursiveUnfollow(value, ids, users, sliceIndex);
    }
  } else if(users.length == 0 && value > 0) {
      console.log("Checking next 99 id's...");
      let oldestUsers = ids.slice(sliceIndex, sliceIndex + 99);
      compareUsers(oldestUsers).then(comparedUsers => {
        recursiveUnfollow(value, ids, comparedUsers, sliceIndex + 99)
      })
  } else {
    return console.log("We have either unfollowed the amount specified, or as many as existed");
  }
}

// initializer
function botUnfollow() {
  let startingValue = 10;
  getFriendsIds().then(data => {
    let oldestUsersFirst = [...data].reverse();
    let initialSlice = oldestUsersFirst.slice(0, 99);
    compareUsers(initialSlice).then(comparedUsers => {
      console.log("Recursive unfollow initialized");
      recursiveUnfollow(startingValue, oldestUsersFirst, comparedUsers, 99);
    })
  }).catch(error => {
    console.log(error)
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
