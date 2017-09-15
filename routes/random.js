var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('random', {randomNum: Math.floor(Math.random()*1000)});
});

module.exports = router;
