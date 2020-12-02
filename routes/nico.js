var express = require('express');
var router = express.Router();
var app = require("../index");
var extend = require('util')._extend;

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
      //console.log(req.session)
      app.io.to(req.params.room_id).emit('like', msg);
      res.end();
    });

    router.get('/comment/:room_id/:name', function(req, res, next) {
      var msg = extend({}, req.query);
      msg.rand = Math.random().toFixed(3)
      msg.name = req.session.name;
      msg.nickname = req.session.nickname;
      msg.duration = msg.duration * req.session.commentDuration;
      //console.log(msg)
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
