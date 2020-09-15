const fs = require("fs");
const twit = require("twit");
var path = require("path");
const config = require("./config.js");
const axios = require("axios");
var express = require("express");
var request = require("request").defaults({ encoding: null });
var search = require("./search.js");

const T = new twit(config);

var app = express();
app.set("port", process.env.PORT || 5000);

app.get("/", function (req, res) {
  res.send("The name's Botto...Doggo Botto");
});

app.get("/post", function (req, res) {
  res.send("Posting Doggo!"), uploadDoggo();
});

app.get("/doggoOTD", function (req, res) {
  getDoggoOTD().then((response) => {
    console.log(response.status)
    if(response.status === 204){
      res.send("Non-user submitted Doggo"), uploadDoggo();
    } else {
      uploadUserDoggo(response)
      res.send('yes')
    }
  })
});

app.get("/search", function (req, res) {
  res.send("hi");
  search.botSearch();
  setTimeout(function () {
    search.botFollow();
  }, 30000);
});

app.post("/submit", function (req, res) {
  const { img, caption, name, username } = req.body
  res.send(`doggo: ${ img, caption, name, username }`)
});

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log("content-type:", res.headers["content-type"]);
    // console.log("content-length:", res.headers["content-length"]);
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

function getDoggoOTD() {
  return axios
    .get("https://doggobase.herokuapp.com/api/posts/images/verified")
    .then((response) => {
      return response
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

function postDoggo(base64) {
  console.log("Uploading an image...");

  getDoggoQuote().then((data) => {
    doggoQuote = data;

    if (doggoQuote.author == "null") {
      doggoQuote.author = "Unknown Author";
    }

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
            status: `${doggoQuote.text} - ${doggoQuote.author}\n\nSubmit your doggo at https://doggobotto.com/!`,
          },
          function (err, data, response) {
            if (err) {
              console.log("ERROR:");
              console.log(err);
            } else {
              console.log("Posted an image!");
              // console.log(Object.keys(response))
              doggoOTD = data.id_str
              console.log(doggoOTD)
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

        T.post(
          "statuses/update",
          {
            media_ids: new Array(data.media_id_string),
            status:
            `
            ⭐Doggo of the Day!⭐${userDoggo.data.caption == null ? '' : '\n\n'+userDoggo.data.caption}\n\nDoggo name: ${userDoggo.data.name}\nSubmitted by: ${userDoggo.data.username == 'null' ? 'anonymous' : '@'+userDoggo.data.username}\n\nSubmit your doggo at https://doggobotto.com/!
            `,
          },
          function (err, data, response) {
            if (err) {
              console.log("ERROR:");
              console.log(err);
            } else {
              axios
              .put(`https://doggobase.herokuapp.com/api/posts/images/${userDoggo.data.id}`, { posted: true })
              .then((response) => {
                console.log(response)
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
      var image_path = path.join(__dirname, `/dogpic/doggo1.jpg`),
        b64content = fs.readFileSync(image_path, { encoding: "base64" });
      postDoggo(b64content);
    });
  });
}

function uploadUserDoggo(userDoggo) {
  console.log("Opening...", userDoggo.data);

  download(userDoggo.data.img, `./dogpic/doggo1.jpg`, function () {
    var image_path = path.join(__dirname, `/dogpic/doggo1.jpg`),
      b64content = fs.readFileSync(image_path, { encoding: "base64" });
    postUserDoggo(b64content, userDoggo);
  });
}

app.listen(app.get("port"), function () {
  console.log("Bot is running on port", app.get("port"));
});
