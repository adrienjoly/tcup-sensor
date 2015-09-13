/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

getSocket(function(socket){
  if (socket)
    socket.emit('infuse', 0);
  $('#submit').click(function(){
    var temp = $('#temp').val();
    socket.emit('setMaxCelsius', temp);
    window.location.href = '/4-cooling.html#' + temp;
  });
});
