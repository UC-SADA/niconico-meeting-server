var express = require('express');
var router = express.Router();

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

router.post('/', function(req, res, next) {
  console.log("login:")
	req.session.ip = getIP(req)
  console.log("name"+req.body.name)
	if(req.body.name != undefined){
		if(req.body.name == ""){
			req.session.name = "Guest"
		}else{
			req.session.name = req.body.name
		}
	}
  console.log("name"+req.session.name)
	if(req.body.room != undefined){
		if(req.body.room == ""){
			req.session.room = "OpenRoom"
		}else{
			req.session.room = req.body.room
		}
	}	
	if (req.session.name == undefined){
		res.redirect("/login/name")
	}else if(req.session.room == undefined){
		res.redirect("/login/room")
	}else{
		req.session.login = true;
		res.redirect("/controller/" + req.session.room + "/?ie=" + req.session.ie)
	}
});

router.post('/logout', function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get('/name', function(req, res, next) {
	res.render("login/index",{
		title : "niconico-Reaction",
		sub_title : "ニックネームの設定:",
		input_name : "name",
	})
});

router.get('/room', function(req, res, next) {
	res.render("login/index",{
		title : "niconico-Reaction",
		sub_title : "ルームの設定:",
		input_name : "room",
	})
});
module.exports = router;
