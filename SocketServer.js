'use strict';

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
  
  // Create Socket.io server
  var server = require('http').createServer(app);
  var io = socketio(/*server*/).listen(server);
  server.listen(port || DEFAULT_PORT);
  console.log("Serving HTTP on port", port || DEFAULT_PORT);

  // Attach a 'connection' event handler to the server
  io.on('connection', function (socket) {
    console.log('Socket.io user connected');
    socket.emit('connected', 'Welcome');

    var sendToSocket = socket.emit.bind(socket, 'celsius');
    tempSensor.on('temp', sendToSocket);

    socket.on('disconnect', function () {
        console.log('Socket.io user disconnected');
        tempSensor.removeListener("temp", sendToSocket);
    });
  });
}

module.exports = SocketServer;
