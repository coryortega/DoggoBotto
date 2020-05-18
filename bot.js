const fs = require('fs');
const twit=require('twit');
var path = require('path');
const config = require('./config.js');
const axios = require('axios');
var express = require('express');
var request  = require('request').defaults({ encoding: null });
var schedule = require('node-schedule');

const T=new twit(config);

var app = express();
app.set('port', process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.send("The name's Botto...Doggo Botto")
})

// i is used to keep track of the Doggo pics stored on the server. Starts at 2 because the program starts with 2 Doggo pics preloaded
i = 2

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function getDoggoQuote(){
  return axios
  .get("https://type.fit/api/quotes")
  .then(response => {

  return item = response.data[Math.floor(Math.random() * response.data.length)];

  })
  .catch(error => {
    console.log("The data was not returned", error);
  });
}

function postDoggo(base64){

  console.log('Uploading an image...');

  getDoggoQuote().then(data => {

    doggoQuote = data

    if(doggoQuote.author == 'null'){
      doggoQuote.author = 'Unknown Author'
    }
  
    T.post('media/upload', { media_data: base64 }, function (err, data, response) {
      if (err){
        console.log('ERROR:');
        console.log(err);
      }
      else{
        console.log('Image uploaded!');
        console.log('Now tweeting it...');  
  
        T.post('statuses/update', {
          media_ids: new Array(data.media_id_string),
          status:`${doggoQuote.text} - ${doggoQuote.author}`
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

  })    

}

function uploadDoggo(){

  console.log('Opening an image...');

  axios
    .get(`https://dog.ceo/api/breeds/image/random/`)
    .then(response => {
    console.log("doggos", response.data.message);

      download(response.data.message, `./dogpic/doggo${i}.jpg`, function(){
          console.log('done'), i++;
        })

      var image_path = path.join(__dirname, `/dogpic/doggo${i-1}.jpg`),
          b64content = fs.readFileSync(image_path, { encoding: 'base64' });

      postDoggo(b64content)
  })
  .catch(error => {
    console.log("The data was not returned", error);
  });

}


// setInterval(function(){uploadDoggo()}, 10000)


var j = schedule.scheduleJob('0 12 * * *', function(){
  uploadDoggo();
});


app.listen(app.get('port'), function() {
  console.log('Bot is running on port', app.get('port'));
});


