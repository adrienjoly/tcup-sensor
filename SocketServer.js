var path = require('path');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var DEFAULT_PORT = 1337;

function SocketServer(){
  this.io = null;
}

SocketServer.prototype.start = function(tempSensor, port){
  // Setup HTTP server
  var app = express();
  app.use(express.static(path.join(__dirname, 'www'), { maxAge: 31557600000 }));
  app.listen(port || DEFAULT_PORT);
  
  // Create Socket.io server
  var server = require('http').Server(app);
  var io = socketio(server);
  console.log("Serving HTTP on port", port || DEFAULT_PORT);

  // Attach a 'connection' event handler to the server
  io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    socket.emit('connected', 'Welcome');

    var sendToSocket = socket.emit.bind(socket, 'message');
    tempSensor.on('temp', sendToSocket);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        tempSensor.removeListener("temp", sendToSocket);
    });
  });
}

module.exports = SocketServer;
