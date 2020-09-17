var request = require("request").defaults({ encoding: null });
const axios = require("axios");
const fs = require("fs");

module.exports = {
    getDoggoQuote,
    getDoggoOTD,
    getDoggoPic,
    download
};

function download (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
}; 

function getDoggoOTD() {
  return axios
    .get("https://doggobase.herokuapp.com/api/posts/images/verified")
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
