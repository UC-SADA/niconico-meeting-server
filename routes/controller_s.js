var express = require('express');
var router = express.Router();

function Stamp_DB(req,res,next,view,room_id,name){
  var msg = "ルーム：" + room_id + "<br>" + "ネーム：" + name
  var duration = req.query.duration
  var name_on = req.query.name_on
  console.log("room:"+room_id+" name:"+ name)
  res.render(view,{
    room:room_id,
    name:name,
    msg : msg,
    duration : duration,
    name_on : name_on
  });
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  Stamp_DB(req,res,next,"controller_s/controller_s","オープンルーム","Guest")
});
router.get('/nicoTest', function(req, res, next) {
  Stamp_DB(req,res,next,"mock-up/controller_s/controller_s","nicoTest","Guest")
});
router.get('/:room_id', function(req, res, next) {
  Stamp_DB(req,res,next,"controller_s/controller_s",req.params.room_id,"Guest")
});
router.get('/nicoTest/:room_id', function(req, res, next) {
  Stamp_DB(req,res,next,"mock-up/controller_s/controller_s",req.params.room_id,"Guest")
});

router.get('/:room_id/:name', function(req, res, next) {
  Stamp_DB(req,res,next,"controller_s/controller_s",req.params.room_id,req.params.name)
});
router.get('/nicoTest/:room_id/:name', function(req, res, next) {
  Stamp_DB(req,res,next,"mock-up/controller_s/controller_s",req.params.room_id,req.params.name)
});
router.post('/nicoTest', function(req, res, next) {
  console.log(req.body)
  res.redirect("/controller_s/controller_s/nicoTest/"+ req.body.room_id2 + "/" + req.session.p_id )
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  res.redirect("/controller_s/controller_s/" + req.body.room_id + "/" + req.session.p_id )
});


module.exports = router;
