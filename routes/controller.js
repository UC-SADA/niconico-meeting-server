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

function Stamp_DB(req,res,next,view){
  req.session.ip = getIP(req);
  req.session.localID = req.session.localID || Math.round(Math.random()*100000);
  req.session.login  = true;
	var msg = "";
	if (req.session.name == undefined){
		res.render("login/index",{
			title : "niconico-Reaction",
			sub_title : "ニックネームの設定:",
			input_name : "name",
		})
	}	else if (req.session.room == undefined)
	{
		res.render("login/index",{
			title : "niconico-Reaction",
			sub_title : "ルームの設定:",
			input_name : "room",
		});
	}
	else{	
		res.render(view,{
			room:req.session.room,
			name:req.session.name,
		});
	}
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.session.name = req.session.name || "Guest";
  req.session.room = req.session.room || "OpenRoom";
  Stamp_DB(req,res,next,"controller/controller")
});
router.get('/nicoTest', function(req, res, next) {
  req.session.name = req.session.name || "Guest";
  req.session.room = req.session.room || "OpenRoom";
  Stamp_DB(req,res,next,"mock-up/controller")
});
router.get('/:room', function(req, res, next) {
  //req.session.name = req.session.name || "Guest";
  req.session.room = req.params.room || "OpenRoom";
  Stamp_DB(req,res,next,"controller/controller")
});
router.get('/nicoTest/:room', function(req, res, next) {
  req.session.name = req.session.name || "Guest";
  req.session.room = req.params.room || "OpenRoom";
  Stamp_DB(req,res,next,"mock-up/controller")
});

router.get('/:room/:name', function(req, res, next) {
  req.session.name = req.params.name || "Guest";
  req.session.room = req.params.room || "OpenRoom";
  Stamp_DB(req,res,next,"controller/controller")
});
router.get('/nicoTest/:room/:name', function(req, res, next) {
  req.session.name = req.params.name || "Guest";
  req.session.room = req.params.room || "OpenRoom";
  Stamp_DB(req,res,next,"mock-up/controller")
});
router.post('/nicoTest', function(req, res, next) {
  res.redirect("/controller/nicoTest/"+ req.body.room_id2 + "/" + req.session.p_id )
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  res.redirect("/controller/" + req.body.room_id + "/" + req.session.p_id )
});


module.exports = router;
