var express = require('express');
var app = require('express')();
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

const os = require('os');
const interfaces = os.networkInterfaces();
const addresses = Object.keys(interfaces)
  .reduce((results, name) => results.concat(interfaces[name]), [])
  .filter((iface) => iface.family === 'IPv4' && !iface.internal)
  .map((iface) => iface.address);
var mkdirp = require("mkdirp")
require('date-utils') //現在時刻の取得に必要
function getLocalAddress() {
    var ifacesObj = {}
    ifacesObj.ipv4 = [];
    ifacesObj.ipv6 = [];
    var interfaces = os.networkInterfaces();
    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, address:details.address})
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, address:details.address})
                    break;
                }
            }
        });
    }
    return ifacesObj;
};

router.get('/', function(req, res, next) {
  var displayUrl
  var controllerUrl
  req.session.room = req.query.room || req.session.room
  req.session.name = req.query.name || req.session.name
  req.session.localmode = req.query.localmode || req.session.localmode
  req.session.commentDuration = req.query.commentDuration || req.session.commentDuration
  req.session.stampDuration = req.query.stampDuration || req.session.stampDuration
  req.session.login  = true
  req.session.ip = getIP(req) 
  console.log(req.session)
	displayUrl = "http://localhost:2525/display/"
  controllerUrl = "http://" + getLocalAddress().ipv4[0].address + ':2525/controller/'|| "http://localhost:2525/controller/"
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
