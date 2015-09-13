'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var DEFAULT_PORT = 1337;

function SocketServer(){}

SocketServer.prototype.start = function(port){
  // Setup HTTP server
  var app = express();
  app.use(express.static(path.join(__dirname, 'www'), { maxAge: 1 })); // 31557600000

  // prevent caching
  app.use(function(req, res, next) {
    req.headers['if-none-match'] = 'no-match-for-this';
    next();    
  });
  
  // Create Socket.io server
  var server = require('http').createServer(app);
  var io = socketio().listen(server);
  server.listen(port || DEFAULT_PORT);
  console.log("Serving HTTP on port", port || DEFAULT_PORT);
  return io;
}

module.exports = SocketServer;
