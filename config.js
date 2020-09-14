if(process.env.CONSUMER_KEY == undefined){
    require('./.env');
  }

module.exports = {
    consumer_key:         process.env.TEST_CONSUMER_KEY,
    consumer_secret:      process.env.TEST_CONSUMER_SECRET,
    access_token:         process.env.TEST_ACCESS_TOKEN,
    access_token_secret:  process.env.TEST_ACCESS_TOKEN_SECRET
  }