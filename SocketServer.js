'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var DEFAULT_PORT = 1337;

function SocketServer(){
  this.io = null;
}

SocketServer.prototype.start = function(port){
  // Setup HTTP server
  var app = express();
  app.use(express.static(path.join(__dirname, 'www'), { maxAge: 31557600000 }));
  
  // Create Socket.io server
  var server = require('http').createServer(app);
  this.io = socketio(/*server*/).listen(server);
  server.listen(port || DEFAULT_PORT);
  console.log("Serving HTTP on port", port || DEFAULT_PORT);
  return this;
}

/*
...then you can attach socket event handlers, by calling socketServer.on('connection', function(socket){
  socket.on('message', ...)
});
*/

SocketServer.prototype.on = function(evtName, handler){
  this.io.on(evtName, handler);
}

SocketServer.prototype.removeListener = function(evtName, handler){
  this.io.removeListener(evtName, handler);
}

module.exports = SocketServer;
