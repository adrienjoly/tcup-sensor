TCup Sensor
===========

TCup helps you improve the quality of your tea consumption, by adapting the infusion process accordingly to the type of tea, and by notifying you when your cup of tea has arrived to your favorite drinking temperature.

Source code of the Iphone client: [TCup-iOS](https://github.com/klefevre/TCup-iOS)

Alternativement, this server also serves a web client to control the sensor. Just open [http://edison.local:1337](http://edison.local:1337) in your web browser as the server is running on your Intel Edison device.

![tcup diy iot hardware project instructables tea](http://cdn.instructables.com/F4G/QF8M/IEIDCSTR/F4GQF8MIEIDCSTR.MEDIUM.jpg)

TemperatureSensor reads analog data from a Grover Starter Kit Plus – IoT Intel® Edition Temperature Sensor.

Usage instructions
------------------

- Assemble the hardware, by following the instructions on the [TCup instructables page](http://www.instructables.com/id/Intel-IoT-Roadshow-Paris-tCup/)
- Push this project to your Intel Edison board
- Install the dependencies: `npm install`
- Run the server on the board: `node main.js`
- Open [http://edison.local:1337](http://edison.local:1337) in your web browser for testing.

Contributors
------------

- [Kevin Lefevre](https://github.com/klefevre)
- Parts of this source code was taken from the [Intel(R) XDK IoT Edition](https://software.intel.com/en-us/html5/xdk-iot) [code samples](https://software.intel.com/en-us/html5/articles/iot-local-temperature-nodejs-and-html5-samples).

License Information Follows
---------------------------
Copyright (c) 2014, Intel Corporation. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.

- Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation 
  and/or other materials provided with the distribution.

- Neither the name of Intel Corporation nor the names of its contributors 
  may be used to endorse or promote products derived from this software 
  without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE 
GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Adding Bluetooth Pairing
========================

So far, and as explained on the instructables page, the IP address of the Edison board must be entered in the iOS client's source code, because no device discovery/pairing mechanisms have been successfully tested for this project yet.

However, we started to integrate some Bluetooth pairing code from Intel's samples.

If you want to enable Bluetooth pairing:
- uncomment the corresponding code from this project,
- add the corresponding npm dependencies,
- and follow the instructions below.

It uses bleno on Intel IoT platforms to advertise it's presence, to read and write data via it's service and corresponding characteristic for Bluetooth Low Energy (BLE) communication.

In order to leverage this project successfully, you will need:

- to use a compatible BLE product such as the [Grove - BLE](http://www.seeedstudio.com/depot/Grove-BLE-p-1929.html),
- to enable bluetooth and disable the bluetooth daemon on Intel(R) Edison,
- to run the client on your mobile phone.

First time - Enabling BLE
-------------------------

Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth 
hciconfig hci0 up

vi /etc/opkg/base-feeds.conf (insert only following lines) 
src/gz all http://repo.opkg.net/edison/repo/all 
src/gz edison http://repo.opkg.net/edison/repo/edison 
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32
```
*For more information on the vi editor, visit* http://www.cs.colostate.edu/helpdocs/vi.html

```
opkg update 
opkg install bluez5-dev
```

**Note:** If bluez fails to install this version, still proceed with remainding steps.

Prerequisite for Bleno - node package to work successfully
----------------------------------------------------------

**Note:** The following steps will need to be executed every time the board is restarted.
Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth 
killall bluetoothd (or, more permanently) systemctl disable bluetooth 
hciconfig hci0 up 
```

You should now be able to use BLE in your project.
