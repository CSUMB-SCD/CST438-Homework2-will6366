var express = require('express');
var router = express.Router();

var https = require("https");
var btoa = require("btoa");

var keys = {
    "client":process.env.TWITTER_CONSUMER_KEY,
    "secret":process.env.TWITTER_CONSUMER_SECRET
}

var fullEncodedKey = btoa(keys.client+":"+keys.secret);


function getTwitterBearerToken(returnBearerToken) {
    
    var options = {
        hostname: "api.twitter.com",
        port: 443,
        path: '/oauth2/token',
        method: 'POST',
        headers: {
            'Authorization':"Basic "+fullEncodedKey,
            'Content-Type':"application/x-www-form-urlencoded;charset=UTF-8",
        }
    };
    
    var postData = 'grant_type=client_credentials';
    
    var apiResponse = '';
    
   var postReq = https.request(options, function(response) {
            response.setEncoding('utf8');
            response.on('data',function(chunk) {
            //   console.log("Received data: "+ chunk); 
               apiResponse += chunk;
            });
            
            response.on('end',function() {
                // console.log("Status Code: "+ response.statusCode);
                // console.log("Complete response: " + apiResponse);
                var objResponse = JSON.parse(apiResponse);
                var accessToken = objResponse.access_token;
                
                returnBearerToken(accessToken);
            });
    }).on('error',function(e) {
        console.log("Got an error: " + e.message);        
    });
    
    postReq.write(postData);
    postReq.end();
}


function makeTwitterApiRequest(bearerToken,returnJsonResponse) {
    var options = {
        hostname: "api.twitter.com",
        port: 443,
        path: '/1.1/search/tweets.json?q=birds',
        method: 'GET',
        headers: {
            'Authorization':"Bearer "+bearerToken
        }
    };
    
    var apiResponse = '';
    
    var twitterRequest = https.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data',function(chunk) {
           apiResponse += chunk;
        });
        
        response.on('end',function() {
            console.log("Status Code: "+ response.statusCode);
            // console.log("Complete response: " + apiResponse);
            // var objResponse = JSON.parse(apiResponse);
            // var tweets = objResponse.statuses;
            returnJsonResponse(apiResponse);
        });
    }).on('error',function(e) {
        console.log("Got an error: " + e.message);        
    });
    
    twitterRequest.end();
}


/* GET getty page. */
router.get('/', function(req, res, next) {
    // res.send("This is the twitter page");
    getTwitterBearerToken(function(bearerToken) {
        // Now we have the bearer token
        // res.send(bearerToken);
        makeTwitterApiRequest(bearerToken,function(responseJson) {
            var jsonObj = JSON.parse(responseJson);
            var statuses = jsonObj.statuses;
            var size = statuses.length;
            res.send(statuses);
            // res.render('twitter', {
            //     "statuses":statuses,
            //     "numStatuses":size
            // });
        });
    });
    
});

module.exports = router;
