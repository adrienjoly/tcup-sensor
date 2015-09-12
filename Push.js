'use strict';

// NOTE: cert.pem and key.pen must be stored in the project's directory
// NOTE: the board must be able to contact to the apns server thru port 2195 => beware of firewalls!
 
var apn = require ('apn');

var kev = '85b7d9369b8c56e33663cbfefd3e71e38c70fa57104520c6158d4aaea409a6d9';
var adrien = '7439479db217737514953a5f71d5e63dc53c2b6647ddf9d18538b122ce826fce';
var tokens = [kev, adrien];

var service = new apn.connection({ production: false });

service.on('connected', function() {
    console.log('Connected');
});

service.on('transmitted', function(notification, device) {
    console.log('Notification transmitted to:' + device.token.toString('hex'));
});

service.on("transmissionError", function(errCode, notification, device) {
	console.error('Notification caused error: ' + errCode + ' for device ', device, notification);
	if (errCode === 8) {
	    console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
	}
});

service.on('timeout', function () {
	console.log('Connection Timeout');
});

service.on('disconnected', function() {
	console.log('Disconnected from APNS');
});

service.on('socketError', console.error);

function pushNotificationsToMany(message) {
    console.log('Sending the same notification each of the devices with one call to pushNotification.');
    var note = new apn.notification();
    note.setAlertText(message);
    note.badge = 1;

    service.pushNotification(note, tokens);
}

module.exports = pushNotificationsToMany;
