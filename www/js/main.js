/*jslint plusplus:true*/

/* jshint strict: true, -W097, unused:false, undef:true */
/*global window, document, $, io, navigator, setTimeout */

function onCelsius(celsius) {
    $('#feedback_log').text('Last update: ' + Date().substr(0, 21));
    $('#gauge > span').text(celsius);
}

// Attempt to connect to server/Intel IoT platform
function connect(callback){
    try {
        var socket = io.connect('http://' + window.location.host);
        socket.on('connected', callback.bind(null, null));
        return socket;
    } catch (e) {
        callback(e);
    }
}

var socket = connect(function(err, message){
    if (err) {
        (navigator.notification || window).alert(
            'Server Not Available!',  // message
            '',                       // callback
            'Connection Error!',      // title
            'Ok'                      // buttonName
        );        
    } else {
        //Apache Cordova Notification
        navigator.notification && navigator.notification.alert(
            'Great Job!',         // message
            '',                   // callback
            'You are Connected!', // title
            'Ok'                  // buttonName
        );
        socket.on('celsius', onCelsius);
        socket.emit('setMaxCelsius', 25);
    }
});
