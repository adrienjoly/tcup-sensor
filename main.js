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

var mraa = require("mraa");

// we want mraa to be at least version 0.6.1
var version = mraa.getVersion();

if (version >= 'v0.6.1') {
    console.log('mraa version (' + version + ') ok');
}
else {
    console.log('meaa version(' + version + ') is old - this code may not work');
}

// Use the upm library to drive the two line display
var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);

var TemperatureSensor = require('./TemperatureSensor');
var SocketServer = require('./SocketServer');

var tempSensor = new TemperatureSensor().start();
var socketServer = new SocketServer().start(tempSensor);

// LCD display: Rotate through a color pallette and display the color of the background as text
function rotateColors(display) {
    var red = 0;
    var green = 0;
    var blue = 0;
    display.setColor(red, green, blue);
    setInterval(function() {
        blue += 64;
        if (blue > 255) {
            blue = 0;
            green += 64;
            if (green > 255) {
                green = 0;
                red += 64;
                if (red > 255) {
                    red = 0;
                }
            }
        }
        display.setColor(red, green, blue);
        display.setCursor(0,0);
        display.write('red=' + red + ' grn=' + green + '  ');
        display.setCursor(1,0);
        display.write('blue=' + blue + '   ');  // extra padding clears out previous text
    }, 1000);
}

rotateColors(display);
