/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

function getVars(){
  var vars = window.location.href.match(/.*\#(\d+)\_(\d+)/);
  if (vars && vars.length > 1) {
    return vars.slice(1).map(parseInt);
  }
}

function simulateBoil(target, handler, callback){
  var celsius = 15;
  var interv = setInterval(function(){
    handler(++celsius);
    if (celsius >= target) {
      clearInterval(interv);
      callback();
    }
  }, 100);
}

getSocket(function(socket){
  if (!socket) return;

  function updateBoil(celsius){
    $('#gauge > span').text(celsius);
  }

  // parse and set url parameters
  var vars = getVars();
  var boilingTarget = vars.shift() || 60;
  var infuseTime = vars.shift() || 10;

  socket.emit('setBoil', boilingTarget);
  
  simulateBoil(boilingTarget, updateBoil, function(){
    window.location.href = '/2-infuse.html#' + infuseTime;
  });
});
