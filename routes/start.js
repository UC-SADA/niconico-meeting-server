var express = require('express');
const app = require('express')();
var router = express.Router();
/* GET users listing. */
var getIP = function (req) {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'];
  }
  if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  }
  if (req.connection.socket && req.connection.socket.remoteAddress) {
    return req.connection.socket.remoteAddress;
  }
  if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  return '0.0.0.0';
};


router.get('/', function(req, res, next) {
  var displayUrl
  var controllerUrl
  req.session.room = req.query.room || req.session.room
  req.session.name = req.query.name || req.session.name
  req.session.localmode = req.query.localmode || req.session.localmode
  req.session.login  = true
  req.session.ip = getIP(req) 
  //console.log(req.session)
	displayUrl = "http://localhost:2525/display/"
	controllerUrl = "http://localhost:2525/controller/"
  if(req.query.quickstart == 1){
    res.render("start/quickstart",{
      displayUrl:displayUrl,
      controllerUrl:controllerUrl,
      room_id:req.query.room,
      name:req.query.name
    }); 
  }else{
    res.render("start/start",{
      displayUrl:displayUrl,
      controllerUrl:controllerUrl
    });
  }
});

module.exports = router;
