/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

function getSocket(callback){

  var socket = null;

  function onSuccess(message){
    //Apache Cordova Notification
    navigator.notification && navigator.notification.alert(
      'Great Job!',         // message
      '',                   // callback
      'You are Connected!', // title
      'Ok'                  // buttonName
    );
    callback(socket);
  }

  // Attempt to connect to server/Intel IoT platform
  try {
    socket = io.connect('http://' + window.location.host);
    socket.on('connected', onSuccess);
  } catch (e) {
    (navigator.notification || window).alert(
      'Server Not Available!',  // message
      '',                       // callback
      'Connection Error!',      // title
      'Ok'                      // buttonName
    );        
  }
}
