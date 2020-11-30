"use strict";
const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
module.exports.io = require('socket.io')(http);
const extend = require('util')._extend
const cookieParser = require('cookie-parser');
const session = require("express-session");
const logger = require('morgan');

http.listen(process.env.PORT || 2525, function(){
  console.log("PORT : " + (process.env.PORT || 2525));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret","secret_key"));
app.use(session({key:"session_id"}));

// Router
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use('/',require('./routes/top'));
app.use('/nico', require('./routes/nico'));
app.use('/display', require('./routes/display'));
app.use('/controller', require('./routes/controller'));
app.use('/start', require('./routes/start'));
app.use('/chart', require('./routes/chart'));
app.use('/login', require('./routes/login'));