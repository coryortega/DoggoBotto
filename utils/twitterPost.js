const twit = require("twit");
const config = require("../config.js");
const T = new twit(config);
var path = require("path");
const axios = require("axios");
const fs = require("fs");
const {
  getDoggoQuote,
  getDoggoPic,
  download,
} = require("../utils/functions.js");

module.exports = {
  uploadDoggo,
  uploadUserDoggo,
};

function postDoggo(base64) {
  console.log("Uploading an image...");

  getDoggoQuote().then((data) => {
    doggoQuote = data;

    T.post("media/upload", { media_data: base64 }, function (
      err,
      data,
      response
    ) {
      if (err) {
        console.log("ERROR:");
        console.log(err);
      } else {
        console.log("Image uploaded!");
        console.log("Now tweeting it...");

        T.post(
          "statuses/update",
          {
            media_ids: new Array(data.media_id_string),
            status: `"${doggoQuote.text}" - ${
              doggoQuote.author == "null" || doggoQuote.author == null
                ? "Unknown author"
                : doggoQuote.author
            }\n\nSubmit your doggo at https://doggobotto.com/!`,
          },
          function (err, data, response) {
            if (err) {
              console.log("ERROR:");
              console.log(err);
            } else {
              console.log("Posted an image!");
              doggoOTD = data.id_str;
              console.log(doggoOTD);
            }
          }
        );
      }
    });
  });
}

function postUserDoggo(base64, userDoggo) {
  console.log("Uploading an image...");

  T.post("media/upload", { media_data: base64 }, function (
    err,
    data,
    response
  ) {
    if (err) {
      console.log("ERROR:");
      console.log(err);
    } else {
      console.log("Image uploaded!");
      console.log("Now tweeting it...");
      console.log("data id:", response);

      T.post(
        "statuses/update",
        {
          media_ids: new Array(data.media_id_string),
          status: `
                ⭐Doggo of the Day!⭐${
                  userDoggo.data.caption == null
                    ? ""
                    : "\n\n" + userDoggo.data.caption
                }\n\nDoggo name: ${userDoggo.data.name}\nSubmitted by: ${
            userDoggo.data.username == "null"
              ? "anonymous"
              : userDoggo.data.username[0] == "@"
              ? userDoggo.data.username
              : "@" + userDoggo.data.username
          }\n\nSubmit your doggo at https://doggobotto.com/!
                `,
        },
        function (err, data, response) {
          if (err) {
            console.log("ERROR:");
            console.log(err);
          } else {
            axios
              .put(
                `https://doggobase.herokuapp.com/api/posts/images/${userDoggo.data.id}`,
                { posted: true }
              )
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error("Server Error", error);
              });
            console.log("Posted an image!");
          }
        }
      );
    }
  });
}

function uploadDoggo() {
  console.log("Opening an image...");

  getDoggoPic().then((data) => {
    download(data, `./dogpic/doggo1.jpg`, function () {
      var image_path = path.join(__dirname, `../dogpic/doggo1.jpg`),
        b64content = fs.readFileSync(image_path, { encoding: "base64" });
      postDoggo(b64content);
    });
  });
}

function uploadUserDoggo(userDoggo) {
  console.log("Opening...", userDoggo.data);

  download(userDoggo.data.img, `./dogpic/doggo1.jpg`, function () {
    var image_path = path.join(__dirname, `../dogpic/doggo1.jpg`),
      b64content = fs.readFileSync(image_path, { encoding: "base64" });
    postUserDoggo(b64content, userDoggo);
  });
}
