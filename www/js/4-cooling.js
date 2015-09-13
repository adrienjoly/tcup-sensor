/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

function getTargetTemp(){
  var temp = window.location.href.match(/.*\#(\d+)/);
  if (temp && temp.length > 1) {
    return parseInt(temp[1]);
  }
}

getSocket(function(socket){
  if (!socket) return;
  // parse and set target temperature, based on url parameter
  var targetTemp = getTargetTemp();
  if (targetTemp) {
    socket.emit('setMaxCelsius', targetTemp);
  }
  // observe temperature of tea cup
  socket.on('celsius', function onCelsius(celsius) {
    celsius = parseInt(celsius);
    $('#feedback_log').text('Last update: ' + Date().substr(0, 21));
    $('#gauge > span').text(celsius);
    if (targetTemp && celsius <= targetTemp) {
      window.location.href = '/5-enjoy.html';
    }
  });
});
