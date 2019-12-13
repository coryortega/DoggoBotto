const fs = require('fs')
const twit=require('twit')
var path = require('path')
const axios = require('axios')
const https = require('https')
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 5000);

// const config=require('./config')

if(process.env.TWITTER_CONSUMER_KEY == undefined){
  require('./env.js');
}

const T=new twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var now = new Date();

var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;

function uploadDoggo(){
  console.log('Opening an image...');

  axios
    .get(`https://dog.ceo/api/breeds/image/random/`)
    .then(response => {
    console.log("doggos", response.data.message);

    const wstream = fs.createWriteStream("./dogpic/dog.jpg");

    const request = https.get(response.data.message, function(response) {
      response.pipe(wstream)
    })
  
  })
.catch(error => {
  console.log("The data was not returned", error);
});

  var image_path = path.join(__dirname, '/dogpic/dog.jpg'),
      b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}

if (millisTill10 < 0) {
     millisTill10 += 86400000;
}

setTimeout(function(){uploadDoggo()}, 5000);
// setTimeout(function(){uploadDoggo()}, millisTill10);




