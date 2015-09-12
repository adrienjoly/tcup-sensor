/*jslint node:true,vars:true,bitwise:true,unparam:true */

/*jshint unused:true */

/*
MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/iot-local-temperature-nodejs-and-html5-samples
*/

var TemperatureSensor = require('./TemperatureSensor');
var SocketServer = require('./SocketServer');
var LcdDisplay = require('./LcdDisplay');
var BluetoothPeripheral = require('./BluetoothPeripheral');
var pushToPhone = require('./Push.js');

var tempSensor = new TemperatureSensor().start(500);
var socketServer = new SocketServer().start();
var display = new LcdDisplay();

socketServer.on('connection', function (socket) {
  console.log('Socket.io user connected');
  
  var sendToSocket = socket.emit.bind(socket, 'celsius');
  tempSensor.on('temp', sendToSocket);

  socket.on('disconnect', function () {
    console.log('Socket.io user disconnected');
    tempSensor.removeListener("temp", sendToSocket);
  });
});

var CONSUMPTION_TEMPERATURE = 0; // 30

console.log("Ideal tea temperature:", CONSUMPTION_TEMPERATURE);

// Attach a 'connection' event handler to the server
socketServer.on('connection', function (socket) {
  console.log('Socket.io user connected');
  socket.emit('connected', 'Welcome');

  var sendToSocket = socket.emit.bind(socket, 'celsius');
  tempSensor.on('temp', sendToSocket);

  socket.on('setMaxCelsius', function(max){
    console.log('maxCelsius <-', max);
    CONSUMPTION_TEMPERATURE = parseInt(max);
  })

  socket.on('disconnect', function () {
      console.log('Socket.io user disconnected');
      tempSensor.removeListener("temp", sendToSocket);
  });
});

var iter = 0;
function onTemperature(celsius){
  if (!iter) {
    console.log('Celsius Temperature:', celsius); 
  }
  iter = (iter + 1) % 5;
  var normTemp = Math.min(255, Math.max(0, celsius - 20) * 3);
  display.setColor(parseInt(normTemp), parseInt(255 - normTemp), 0);
  display.setCursor(0, 0);
  display.write('tea: ' + ('' + celsius).substr(0, 4) + 'degrees');

  if (celsius <= CONSUMPTION_TEMPERATURE) {
    tempSensor.removeListener('temp', onTemperature);
    display.setColor(0, 0, 255);
    display.setCursor(0, 0);
    display.write('ready to drink! ');
    pushToPhone('your tea is ready to drink!');
  }
}

setTimeout(function(){
  tempSensor.on('temp', onTemperature);
}, 1000);
