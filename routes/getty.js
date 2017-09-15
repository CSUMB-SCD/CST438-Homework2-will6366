var express = require('express');
var router = express.Router();


function makeApiRequest(phrase="coffee", sendBrowserResponse) {
    var https = require("https");
    
    
    const options = {
        hostname: "api.gettyimages.com",
        port: 443,
        path: '/v3/search/images?phrase='+phrase,
        method: 'GET',
        headers: {
            'Api-Key':process.env.GETTY_API_KEY
            // 'Api-Key' : "pertea4dv6ampcx9du5m295z"
        }
    };
    
    var apiResponse = '';
    
    https.get(options, function(response) {
            response.setEncoding('utf8');
            response.on('data',function(chunk) {
            //   console.log("Received data: "+ chunk); 
               apiResponse += chunk;
            });
            
            response.on('end',function() {
                console.log("Status Code: "+ response.statusCode);
                console.log("Complete response: " + apiResponse);
                sendBrowserResponse(apiResponse);
                // GET Image Urls:
                // var obj = JSON.parse(apiResponse);
                // console.log(obj["images"][0]["display_sizes"][0]["uri"]);
            });
    }).on('error',function(e) {
        console.log("Got an error: " + e.message);        
    });
}



/* GET getty page. */
router.get('/', function(req, res, next) {
    //   res.render('getty', {});
    makeApiRequest("gaming",function(jsonToSendBack) {
        var obj = JSON.parse(jsonToSendBack);
        var images = obj["images"];
        var size = images.length;
        // res.send("Size: "+size);
        
        res.render('getty', {
            'jsonImage' : JSON.parse(jsonToSendBack),
            'imageArraySize' : size
        })
    });
});

/* GET getty page. */
router.get('/:phrase', function(req, res, next) {
    makeApiRequest(req.params.phrase,function(jsonToSendBack) {
        var obj = JSON.parse(jsonToSendBack);
        var images = obj["images"];
        var size = images.length;
        // res.send("Size: "+size);
        
        res.render('getty', {
            'jsonImage' : JSON.parse(jsonToSendBack),
            'imageArraySize' : size
        })
    });
});
module.exports = router;
