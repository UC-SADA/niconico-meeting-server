var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var room = req.query.room;
	var name = req.query.name;
  var view = "display/display"
	
//  var room = "Open_room"
//  var name = "Guest"
  if (req.query.HMD == 1){
    view = "display/HMD"
  }else if (req.query.HMD == 2){
    view = "display/QR"
  }else if (req.query.HMD == 3){
    view = "display/displayHMD"
  }
  res.render(view,{
    room:room,
    name:name
  });
});
router.get('/:room_id', function(req, res, next) {
  var room = req.params.room_id
  var name = "Guest"
  var view = "display/display"
  if (req.query.HMD == 1){
    view = "display/HMD"
  }else if (req.query.HMD == 2){
    view = "display/QR"
  }else if (req.query.HMD == 3){
    view = "display/displayHMD"
  }
  res.render(view,{
    room:room,
    name:name
  });
});

module.exports = router;
