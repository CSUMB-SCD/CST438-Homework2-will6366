var express = require('express');

// Create Router File
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


function makeGettyApiRequest(sendBrowserResponse) {
    var https = require("https");
    
    
    const options = {
        hostname: "api.gettyimages.com",
        port: 443,
        path: 'https://api.gettyimages.com/v3/search/images?fields=id,detail_set&phrase=gaming&sort_order=most_popular',
        method: 'GET',
        headers: {
            'Api-Key':process.env.GETTY_API_KEY
        }
    };
    
    var apiResponse = '';
    
    https.get(options, function(response) {
            response.setEncoding('utf8');
            response.on('data',function(chunk) {
               apiResponse += chunk;
            });
            
            response.on('end',function() {
                console.log("Status Code: "+ response.statusCode);
                sendBrowserResponse(apiResponse);
            });
    }).on('error',function(e) {
        console.log("Got an error: " + e.message);        
    });
}


function makeTwitterApiRequest(bearerToken,returnJsonResponse) {
    var options = {
        hostname: "api.twitter.com",
        port: 443,
        path: '/1.1/search/tweets.json?q=twitch&result_type=popular',
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
            returnJsonResponse(apiResponse);
        });
    }).on('error',function(e) {
        console.log("Got an error: " + e.message);        
    });
    
    twitterRequest.end();
}


/* GET getty page. */
router.get('/', function(req, res, next) {
    makeGettyApiRequest(function(gettyResponseJson) {
        var gettyObj = JSON.parse(gettyResponseJson);
        var gettyImages = gettyObj["images"];
        var gettyImageArrLength = gettyImages.length;
        
        getTwitterBearerToken(function(bearerToken) {
        // once twitter bearer token is received, make api requests
        
            makeTwitterApiRequest(bearerToken,function(twitterResponseJson) {
            var twitterObj = JSON.parse(twitterResponseJson);
            var twitterStatuses = twitterObj.statuses;
            var twitterStatusArrLength = twitterStatuses.length;
                
                res.render('index', {
                    "title":"Getty-Twitter API",
                    "twitterStatuses":twitterStatuses,
                    "twitterStatusArrLength":twitterStatusArrLength,
                    "gettyImages":gettyImages,
                    "gettyImageArrLength":gettyImageArrLength
                });
            
            });
        
        });
    });
});



// Return value of entire file
module.exports = router;
