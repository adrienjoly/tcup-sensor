/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */

var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var BluetoothCharacteristic = function(uuid) {
  BluetoothCharacteristic.super_.call(this, {
    uuid: uuid,
    properties: ['read', /*'write',*/ 'notify'],
    value: null
  });

  this._value = new Buffer("Hello World from Edison!", "utf-8");
  console.log("Characterisitic's value: "+this._value);
    
  this._updateValueCallback = null;
};

util.inherits(BluetoothCharacteristic, BlenoCharacteristic);

BluetoothCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('BluetoothCharacteristic - onReadRequest: value = ' + this._value.toString("utf-8"));
  callback(this.RESULT_SUCCESS, this._value);
};

BluetoothCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
    console.log('BluetoothCharacteristic - onWriteRequest: value = ' + this._value.toString("utf-8"));

  if (this._updateValueCallback) {
    console.log('BluetoothCharacteristic - onWriteRequest: notifying');
    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

BluetoothCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('BluetoothCharacteristic - onSubscribe');
  this._updateValueCallback = updateValueCallback;
};

BluetoothCharacteristic.prototype.onUnsubscribe = function() {
  console.log('BluetoothCharacteristic - onUnsubscribe');
  this._updateValueCallback = null;
};

module.exports = BluetoothCharacteristic;
