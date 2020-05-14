const fs = require('fs')
const twit=require('twit')
var path = require('path')
const axios = require('axios')
const https = require('https')
var express = require('express');
var request  = require('request').defaults({ encoding: null });
var http = require('http');
var {Base64Encode} = require('base64-stream');

var app = express();
app.set('port', process.env.PORT || 5000);
// app.set('port', 5000);


if(process.env.TWITTER_CONSUMER_KEY == undefined){
  require('./.env');
}

var config = {
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const T=new twit(config)

var now = new Date();

let i = 2

var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;

// fs.writeFile(`/dogpic/dog${i + 1}.jpg`, 'temp', (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   //file written successfully
//   console.log('file written')
// })

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function postDoggo(base64){

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: base64 }, function (err, data, response) {
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

        // console.log('Uploading an image...');

        // T.post('media/upload', { media_data: string }, function (err, data, response) {
        //   if (err){
        //     console.log('ERROR:');
        //     console.log(err);
        //   }
        //   else{
        //     console.log('Image uploaded!');
        //     console.log('Now tweeting it...');
      
        //     T.post('statuses/update', {
        //       media_ids: new Array(data.media_id_string)
        //     },
        //       function(err, data, response) {
        //         if (err){
        //           console.log('ERROR:');
        //           console.log(err);
        //         }
        //         else{
        //           console.log('Posted an image!');
        //         }
        //       }
        //     );
        //   }
        // });
    //     }
    // });

    // const request = https.get(response.data.message, function(response) {
    //   response.pipe(wstream)
    // })

  })
.catch(error => {
  console.log("The data was not returned", error);
});

  // var image_path = path.join(__dirname, `/dogpic/dog${i}.jpg`),
  //     b64content = fs.readFileSync(image_path, { encoding: 'base64' });


  // console.log('Uploading an image...');

  // T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  //   if (err){
  //     console.log('ERROR:');
  //     console.log(err);
  //   }
  //   else{
  //     console.log('Image uploaded!');
  //     console.log('Now tweeting it...');

  //     T.post('statuses/update', {
  //       media_ids: new Array(data.media_id_string)
  //     },
  //       function(err, data, response) {
  //         if (err){
  //           console.log('ERROR:');
  //           console.log(err);
  //         }
  //         else{
  //           console.log('Posted an image!');
  //         }
  //       }
  //     );
  //   }
  // });

}

if (millisTill10 < 0) {
     millisTill10 += 86400000;
}


setInterval(function(){uploadDoggo()}, 10000)
// setTimeout(function(){uploadDoggo()}, 5000);
// setTimeout(function(){uploadDoggo()}, millisTill10);

app.listen(app.get('port'), function() {
  console.log('Bot is running on port', app.get('port'));
});


