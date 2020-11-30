var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  var msg = "";
  res.render("top/index",{
    title : "niconico-Reaction",
    msg : msg,
  });
});
router.get('/favicon.ico', function(req, res, next) {
});
module.exports = router;
