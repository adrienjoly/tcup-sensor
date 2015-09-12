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

function LcdDisplay(){}

LcdDisplay.prototype.setColor = display.setColor.bind(display);
LcdDisplay.prototype.setCursor = display.setCursor.bind(display);
LcdDisplay.prototype.write = display.write.bind(display);

module.exports = LcdDisplay;
