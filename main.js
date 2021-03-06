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

var SocketServer = require('./SocketServer');
var StepRunner = require('./StepRunner.js');
//var BluetoothPeripheral = require('./BluetoothPeripheral');

var socketServer = new SocketServer().start();
var stepRunner = new StepRunner();

socketServer.on('connection', function (socket) {
  console.log('Socket.io user connected');
  stepRunner.setSocket(socket); // also releases the current step's task
  socket.emit('connected', 'Welcome');
 
  socket.on('disconnect', function () {
    console.log('Socket.io user disconnected');
    //stepRunner.release();
  });
});

stepRunner.run(0);  
 