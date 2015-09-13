/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

function getVar(){
    var vars = window.location.href.match(/.*\#(\d+)/);
    if (vars && vars.length == 2) {
      return parseInt(vars[1]);
    }
}

function simulateInfuse(seconds, handler, callback){
  var interv = setInterval(function(){
    handler(--seconds);
    if (!seconds) {
      clearInterval(interv);
      callback();
    }
  }, 1000);
}

getSocket(function(socket){
  if (!socket) return;

  function updateTime(seconds){
    $('#gauge > span').text(seconds);
  }

  // parse and set url parameters
  var infuseTime = getVar() || 20;

  socket.emit('infuse', infuseTime);
  
  simulateInfuse(infuseTime, updateTime, function(){
    window.location.href = '/3-select-temp.html';
  });
});
