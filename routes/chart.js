var express = require('express');
var router = express.Router();
var app = require("../index");
var extend = require('util')._extend;
const fs = require('fs');
const load_DIR = './public/images';
const intervalTime = 3000; //グラフを更新する間隔
//load_DIR　ディレクトリに格納しているファイル一覧をfileListに格納
var fileList ;
fs.readdir(load_DIR, function(err, files){
  if (err) throw err;
	fileList = files;
	for(var i = 0;i<files.length;i++){
		fileList[i] = fileList[i].slice(0,-4)
	}
});

var userList = {};
var rooms =[];
var datasets = {};  // グラフ化するデータセット

function stampCount(stamp){
	for(var i =0;i< rooms.length;i++){
		userList[rooms[i]][stamp].splice(1,0,[]);
		userList[rooms[i]][stamp].splice(3,1);
		userList[rooms[i]][stamp][0] = [...new Set([...userList[rooms[i]][stamp][1],...userList[rooms[i]][stamp][2]])]
		datasets[rooms[i]][stamp].data.push(userList[rooms[i]][stamp][0].length)
		if(datasets[rooms[i]][stamp].data.length >10){
			datasets[rooms[i]][stamp].data.shift()
		}
	}
}

var connectCheck = setInterval(function(){
	if(rooms.length >0){
		stampCount("total")
		app.io.emit("connectCheck")
		for(var i =0;i<fileList.length;i++){
			stampCount(fileList[i])
		}
		for(var i =0; i<rooms.length; i++){
			app.io.to(rooms[i]).emit('chart', datasets[rooms[i]])
		}
	}
}
,intervalTime)

app.io.sockets.on('connection', function(socket) {
  socket.on('client_to_server_join', function(room) {
    socket.join(room);
  });
  router.get('/:room_id', function(req, res, next) {
    const room_id = req.params.room_id
    res.render("chart/00_layout",{
      room:room_id,
      cnt:datasets[room_id]
    });
  });
  router.get('/like/:room_id/:name', function (req, res) {
    const room_id = req.params.room_id
    const msg = extend({}, req.query);
  
    if(req.session.login == true ){
      if(userList[room_id][msg.image][0].indexOf(req.session.ip) ==-1){
        userList[room_id][msg.image][0].push(req.session.ip);
      }
      if(userList[room_id][msg.image][1].indexOf(req.session.ip) ==-1){
        userList[room_id][msg.image][1].push(req.session.ip);
      }
      console.log(msg.image);
      console.log(userList[room_id][msg.image]);
    }
    for(var i =0; i<fileList.length; i++){
      datasets[room_id][fileList[i]].data[datasets[room_id][fileList[i]].data.length-1] = (userList[room_id][fileList[i]][0].length)
    }
    app.io.to(room_id).emit('chart', datasets[room_id])
    res.end()
  });
  router.get('/connect/:room_id', function(req, res, next) {
    const room_id = req.params.room_id
    //console.log("connect");
    if(userList[room_id] == undefined){
      rooms.push(room_id);
      userList[room_id] = {"total":[[],[],[],[],[],[]]};
      datasets[room_id] = {"total":{"label":"Login","data":[],"borderColor": "rgba(255,0,0,1)","backgroundColor": "rgba(0,0,0,0)"}}
      for (var i = 0;i<fileList.length;i++){
        userList[room_id][fileList[i]] = [[],[],[],[],[],[]]
        var color = "rgba(" + 255*Math.random() + "," + 255*Math.random() +"," + 255*Math.random()+",0.5)"
        datasets[room_id][fileList[i]]  = {"label":fileList[i],"data":[],"borderColor": color,"backgroundColor": "rgba(0,0,0,0)"}
      }
      
      console.log("connect_set");
    }
    if(req.session.login == true ){
      if(userList[room_id]["total"][0].indexOf(req.session.ip) ==-1){
        userList[room_id]["total"][0].push(req.session.ip);
      }
      if(userList[room_id]["total"][1].indexOf(req.session.ip) ==-1){
        userList[room_id]["total"][1].push(req.session.ip);
      }
      //console.log("connect_push");
    }
    
    res.end()
  });
});
router.get('/:room_id', function(req, res, next) {
  const room_id = req.params.room_id
  res.render("chart/00_layout",{
    room:room_id,
    chart:req.session.chart,
    cnt:datasets[room_id]
  });
});

/* GET users listing. */


module.exports = router;
