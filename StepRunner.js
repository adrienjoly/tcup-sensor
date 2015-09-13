var TemperatureSensor = require('./TemperatureSensor');
var LcdDisplay = require('./LcdDisplay');
//var pushToPhone = require('./Push.js');

var tempSensor = new TemperatureSensor().start(500);
var display = new LcdDisplay();

var CONSUMPTION_TEMPERATURE = 0; // 30
console.log("Ideal tea temperature:", CONSUMPTION_TEMPERATURE);

function StepRunner(props){

  this.socket = null;
  this.currentStep = null;
  this.currentStepReleaser = null;

  for (var i in props){
    this[i] = props[i];
  }

  var _this = this;

  this.STEPS = {
    0: function run(){
      display.setColor(0, 0, 0);
      display.writeLines(['', '']);
    },
    1: function run(){
      display.setColor(0, 0, 255);
      display.writeLines(['A cup of tea?', '']);
    },
    2: function run(){
      display.setColor(255, 0, 0);
      var lines = ['o o o o o o o o', ' o o o o o o o o'];
      function bubbles(){
        lines.push(lines.shift());
        display.writeLines(lines);
      }
      var interv = setInterval(bubbles, 400);
      bubbles();
      return function release(){
        clearInterval(interv);
      };
    },
    3: function run(){
      display.setColor(255, 255, 0);
      display.writeLines(['Loading theine...', '']);
    },
    4: function run(){
      function release(){
        tempSensor.removeListener("temp", onTemperature);
      };
      function onTemperature(celsius){
        var normTemp = Math.min(255, Math.max(0, celsius - 20) * 3);
        display.setColor(parseInt(normTemp), parseInt(255 - normTemp), 0);
        display.writeLines(['Cooling tea...', ' ' + ('' + celsius).substr(0, 4) + ' celsius']);
        if (celsius <= CONSUMPTION_TEMPERATURE) {
          release();
          _this.run(5);
        }
        if (_this.socket)
          _this.socket.emit('celsius', celsius);
      }
      tempSensor.on('temp', onTemperature);
      return release;
    },
    5: function run(){
      display.setColor(0, 0, 255);
      display.writeLines(['Enjoy your tea!', ':-)']);
      //try { pushToPhone('your tea is ready to drink!'); } catch(e) {};
    }
  };
}

StepRunner.prototype.release = function releaseStep(){
  if (this.currentStepReleaser) {
    console.log('releasing step', this.currentStep);
    this.currentStepReleaser();
    this.currentStepReleaser = null;
  }
  this.run(0, true); // back to blank state
}

StepRunner.prototype.run = function runStep(i, noRelease){
  if (!noRelease) {
    this.release();
  }
  console.log('STEP', i);
  this.currentStep = i;
  this.currentStepReleaser = this.STEPS[i]();
};

StepRunner.prototype.setSocket = function setSocket(socket){
  this.release();
  this.socket = socket;
  var _this = this;

  socket.on('selection', function(celsius){
    _this.run(1);
  });

  socket.on('setBoil', function(celsius){
    _this.run(2);
  });

  socket.on('infuse', function(seconds){
    _this.run(3);
  });

  socket.on('setMaxCelsius', function(max){
    console.log('maxCelsius <-', max);
    CONSUMPTION_TEMPERATURE = parseInt(max);
    _this.run(4);
  });

  socket.on('enjoy', function(){
    _this.run(5);
  });
}

module.exports = StepRunner;
