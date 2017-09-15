var express = require('express');

// Create Router File
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.send : send text, json object, number
    // res.send(some status number)
    // res.render: template(view file) + json object of all values
  res.render('index', { 
      title: 'Express', 
      className: 'CST438' 
  });
});

// Other uses
router.get('/index/:num', function(req, res, next) {
    // :num is a query from url (index/33), num = 33
    // Access all post variables (append .queryName)
    // Display the number sent in the query
    res.send(req.params.num, 200);
});


// Return value of entire file
module.exports = router;
