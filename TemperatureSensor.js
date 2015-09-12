var util = require("util");
var EventEmitter = require("events").EventEmitter;

var mraa = require("mraa");
var myAnalogPin = new mraa.Aio(0); // GROVE Kit A0 Connector --> Aio(0)

var B = 3975;

function TemperatureSensor(){
  EventEmitter.call(this);
  this.interval = null;
}

util.inherits(TemperatureSensor, EventEmitter);

TemperatureSensor.prototype.probe = function () {
  var a = myAnalogPin.read();
  var resistance = (1023 - a) * 10000 / a;
  var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;
  console.log('Celsius Temperature:', celsius_temperature); 
  var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
  this.emit('temp', fahrenheit_temperature);
  return this;
}

TemperatureSensor.prototype.start = function(){
  this.stop();
  this.interval = setInterval(this.probe.bind(this), 1000);
  return this;
}

TemperatureSensor.prototype.stop = function(){
  if (this.interval) {
    clearInterval(this.interval);
    this.interval = null;
  }
  return this;
}

module.exports = TemperatureSensor;
