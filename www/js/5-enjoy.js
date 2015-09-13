/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

getSocket(function(socket){
  if (socket)
    socket.emit('enjoy', 0);
});
