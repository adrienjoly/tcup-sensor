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

// LCD display: Rotate through a color pallette and display the color of the background as text
function rotateColors() {
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
  }, 100);
}

module.exports = rotateColors;
