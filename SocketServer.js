var http = require('http');
var socketio = require('socket.io');

var DEFAULT_PORT = 1337;

function SocketServer(){
  this.io = null;
}

SocketServer.prototype.start = function(tempSensor, port){
  // Create Socket.io server
  var app = http
    .createServer(function (req, res) {
      'use strict';
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('<h1>Hello world from Intel IoT platform!</h1>');
    })
    .listen(port || DEFAULT_PORT);
  
  var io = socketio(app);

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
