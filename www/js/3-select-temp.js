/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

getSocket(function(socket){
  $('#submit').click(function(){
    if (!socket) return;
    var temp = $('#temp').val();
    socket.emit('setMaxCelsius', temp);
    window.location.href = '/4-cooling.html#' + temp;
  });
});
