const fs = require('fs');
const twit=require('twit');
var path = require('path');
const config = require('./config.js');
const axios = require('axios');
var express = require('express');
var request  = require('request').defaults({ encoding: null });

const T=new twit(config);

var app = express();
app.set('port', process.env.PORT || 5000);

let userNames = {};

app.get('/search', function (req, res) {
    res.send(userNames)
})

function botSearch() {
    T.get('search/tweets', {q: '#dog'}, function(error, tweets, response) {
        tweets.statuses.forEach(function(tweet) {
            userNames[tweet.user.name] = tweet.user.id
            console.log(userNames)
        });
    });
}


function botFollow() {
    for(let i = 0; i < 10; i++){
            T.post('friendships/create', {Name: Object.keys(userNames)[i], user_id: userNames[Object.keys(userNames)[i]]}, function(error, response) {
                if(error){
                    console.log(error, userNames[i])
                } else {
                    console.log(response, i);
                    userNames = {};
                }
        });
    }
}


setInterval(function(){ console.log("first"), botSearch(); }, 45000);
setInterval(function(){ console.log("last"), botFollow(); }, 60000);

app.listen(app.get('port'), function() {
  console.log('Bot is running on port', app.get('port'));
});
