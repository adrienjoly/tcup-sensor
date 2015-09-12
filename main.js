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

var tempSensor = new TemperatureSensor().start(500);
var socketServer = new SocketServer().start(tempSensor);

var LcdDisplay = require('./LcdDisplay');
var display = new LcdDisplay();

var BluetoothPeripheral = require('./BluetoothPeripheral');

var iter = 0;

tempSensor.on('temp', function(celcius){
  if (!iter) {
    console.log('Celsius Temperature:', celcius); 
  }
  iter = (iter + 1) % 5;
  var normTemp = Math.min(255, Math.max(0, celcius - 20) * 3);
  display.setColor(parseInt(normTemp), parseInt(255 - normTemp), 0);
  display.setCursor(0, 0);
  display.write('celsius=' + celcius + ' ');
});
