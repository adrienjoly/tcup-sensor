/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

//getSocket(function(socket){
  $('#submit').click(function(){
    //if (!socket) return;
    var boiltemp = $('#boiltemp').val();
    var infusetime = $('#infusetime').val();
    window.location.href = '/1-boiling.html#' + [boiltemp, infusetime].join("_");
  });
//});
