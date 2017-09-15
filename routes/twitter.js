var express = require('express');
var router = express.Router();

var https = require("https");
var btoa = require("btoa");

var keys = {
    "client":process.env.TWITTER_CONSUMER_KEY,
    "secret":process.env.TWITTER_CONSUMER_SECRET
}

var fullEncodedKey = btoa(keys.client+":"+keys.secret);



/* GET getty page. */
router.get('/', function(req, res, next) {
    res.send("This is the twitter page");
    
});

module.exports = router;
