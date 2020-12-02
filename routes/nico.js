var express = require('express');
var router = express.Router();
var app = require("../index");
var extend = require('util')._extend;
const path = require('path');
const mkdirp = require("mkdirp")
const fs = require('fs');
//logデータの出力
const getDirName = path.dirname
var logData = {};
function writeFile (path, contents, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err)
    fs.writeFile(path, contents, cb)
  })
}

//ファイルの追記関数
function appendFile(path, data, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err)
    fs.appendFile(path, data, function (err) {
      if (err) {
          throw err;
      }
    });
  })
}

var dt = new Date()
appendFile("./Log/"+dt.toFormat("YYYYMMDD")+"stamp.csv",dt.toFormat("YYYY年MM月DD日HH24時MI分SS秒")+ "アプリ起動"+ "\n" + "TIME,ROOM,NAME,ID,Stamp,"+ "\n");
appendFile("./Log/"+dt.toFormat("YYYYMMDD")+"comment.csv",dt.toFormat("YYYY年MM月DD日HH24時MI分SS秒")+ "アプリ起動"+ "\n" + "TIME,ROOM,NAME,ID,Comment,"+ "\n");
app.io.sockets.on('connection', function(socket) {
    socket.on('client_to_server_join', function(room) {
        socket.join(room);
    });

    router.get('/like/:room_id/:name', function (req, res, next) {
      var msg = extend({}, req.query);
      msg.rand_h = Math.random().toFixed(3)
      msg.rand_w = Math.random().toFixed(3)
      msg.name = req.session.name;
      msg.nickname = req.session.nickname;
      msg.duration = app.localSetting.stampDuration;
      app.io.to(req.params.room_id).emit('like', msg);
      var dt = new Date()
      appendFile("./Log/"+dt.toFormat("YYYYMMDD")+"stamp.csv",dt.toFormat("YYYY年MM月DD日HH24時MI分SS秒") + "," + req.params.room_id +"," + msg.name + "," + JSON.stringify(req.session.localID)+ "," + JSON.stringify(msg.image)+"\n");
      res.end();
    });

    router.get('/comment/:room_id/:name', function(req, res, next) {
      var msg = extend({}, req.query);
      msg.rand = Math.random().toFixed(3)
      msg.name = req.session.name;
      msg.nickname = req.session.nickname;
      msg.duration = msg.duration * req.session.commentDuration || req.session.commentDuration;
      var dt = new Date()
      appendFile("./Log/"+dt.toFormat("YYYYMMDD")+"comment.csv",dt.toFormat("YYYY年MM月DD日HH24時MI分SS秒") +"," + req.params.room_id +"," + msg.name + "," + JSON.stringify(req.session.localID)+ "," + JSON.stringify(msg.body)+"\n");
      app.io.to(req.params.room_id).emit('comment', msg);
      res.end()
    });

    router.get('/question/:room_id', function (req, res, next) {
      const id = req.query.id;
      console.log(id);
      app.io.to(req.params.room_id).emit('poll', id);
      res.end();
    });

    router.get('/nickname', function (req, res, next) {
      req.session.nickname = req.query.nickname;
      console.log(req.query)
      res.end();
    });

  });

module.exports = router;
