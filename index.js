"use strict";
const electron = require('electron');
const elc_app = electron.app;
const elc_BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const fs = require("fs")
const path = require('path');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
module.exports.io = require('socket.io')(http);
const extend = require('util')._extend
const cookieParser = require('cookie-parser');
const session = require("express-session");
const logger = require('morgan');

let inputWindow;
let isLoginWindow = false;

//　設定データの読み込み
const defaultConfig = {
    "name": "",
    "room": "TEST_ROOM",
    "stampDuration": 4000,
    "commentDuration": 4000,
    "quickstart": 0,
    "localmode": 1
}

if (!fs.existsSync("config/default.json")) {
  if(!fs.existsSync("config")) {
    fs.mkdirSync("config");
  }
  fs.writeFileSync("config/default.json", JSON.stringify(defaultConfig));
}

const config = require("config")

var localSetting = {"commentDuration":2000,"stampDuration":2000};
localSetting.commentDuration =  config.commentDuration || 2000;
localSetting.stampDuration =  config.stampDuration || 2000;
exports.localSetting = localSetting;
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
app.use('/login', require('./routes/login'));

// ログイン要求時に発火するイベント

elc_app.on('ready', function (event) {
console.log(config);
console.log(getLocalAddress().ipv4[0].address);
var conf = "?";
for (var i = 0;i<Object.keys(config).length;i++){
  conf += Object.keys(config)[i] + "=" + Object.values(config)[i] + "&"
}
inputWindow = new electron.BrowserWindow({
    width: 300,
    height: 180,
    webPreferences: {
      nodeIntegration: true
    }
});
inputWindow.setAlwaysOnTop(true);
//  inputWindow.setMenu(null);
//  inputWindow.openDevTools();
//inputWindow.loadURL('http://localhost:2525/start'+conf); 
inputWindow.loadURL("http://" + getLocalAddress().ipv4[0].address + ':2525/start'+conf); 
});
