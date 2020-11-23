const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);


function botUnfollow(callback) {

    T.get("friends/ids", { screen_name: 'doggos4all'}, function (error, data, response) {
      let oldestFriends = data.ids.slice(-30)
        // callback(null, data)
        T.get("friendships/lookup", { screen_name: 'doggos4all', user_id: oldestFriends}, function (error, data, response) {
          data.forEach(function (follower) {
            if(follower.connections.length == 1 && follower.screen_name != "doggos4all") {
              T.post(
                "friendships/destroy",
                {
                  user_id: follower.id,
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
          });
            callback(null, data)
        });
    });
}

module.exports = {
  botUnfollow
}


