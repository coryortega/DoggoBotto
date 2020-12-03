const twit = require("twit");
var request = require("request").defaults({ encoding: null });
const axios = require("axios");
const fs = require("fs");
const config = require("../config.js");
const T = new twit(config);


function download (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
}; 

function getDoggoOTD() {
  return axios
    .get(`${process.env.DOGGO_BOTTO_BE}/api/posts/images/verified`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("The data was not returned", error);
    });
}

function getDoggoQuote() {
  return axios
    .get("https://type.fit/api/quotes")
    .then((response) => {
      return (item =
        response.data[Math.floor(Math.random() * response.data.length)]);
    })
    .catch((error) => {
      console.log("The data was not returned", error);
    });
}

function getDoggoPic() {
  return axios
    .get(`https://dog.ceo/api/breeds/image/random/`)
    .then((response) => {
      console.log("doggos", response.data.message);

      return response.data.message;
    })
    .catch((error) => {
      console.log("The data was not returned", error);
    });
} 

function getFriendsIds() {
  return new Promise((resolve, reject) => {
    T.get(
      "friends/ids",
      { screen_name: "doggos4all" },
      function (error, data, response) {
        if(data.errors) {
          console.log(data.errors)
        } else {
          let validIds = data.ids.filter((id) => {
            return id.toString().length < 15;
          });
          if(validIds) {
            resolve(validIds)
          } else {
            reject(Error(error))
          }
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
        console.log("Unfollowed user with id:", userId);
      }
    }
  );
}

module.exports = {
  download,
  getDoggoQuote,
  getDoggoOTD,
  getDoggoPic,
  getFriendsIds,
  compareUsers,
  unfollowUser
};
