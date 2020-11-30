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
  var chartUrl
  req.session.room = req.query.room || req.session.room
  req.session.name = req.query.name || req.session.name
  req.session.testmode = req.query.testmode || req.session.testmode
  req.session.chart = req.query.chart || req.session.chart
  req.session.login  = true
  req.session.ip = getIP(req) 
  //console.log(req.session)
	if (req.session.testmode == 1){
		displayUrl = "http://localhost:2525/display/"
		controllerUrl = "http://localhost:2525/controller/"
		chartUrl = "http://localhost:2525/chart/"
	}else{	
		displayUrl = "https://niconico-reaction.herokuapp.com/display/"
		controllerUrl = "https://niconico-reaction.herokuapp.com/controller/"
		chartUrl = "https://niconico-reaction.herokuapp.com/chart/"
	}
  if(req.query.quickstart == 1){
    res.render("start/quickstart",{
      displayUrl:displayUrl,
      controllerUrl:controllerUrl,
      chartUrl:chartUrl,
      room_id:req.query.room,
      name:req.query.name
    }); 
  }else{
    res.render("start/start",{
      displayUrl:displayUrl,
      controllerUrl:controllerUrl,
      chartUrl:chartUrl
    });
  }
});

module.exports = router;
