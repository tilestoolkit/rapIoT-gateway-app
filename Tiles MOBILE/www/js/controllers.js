'use strict';

/* Controllers */

angular.module('tiles.controllers', [])

.controller('TilesCtrl', ['$scope', function($scope) {
    
    // connect to MQTT server/broker
    var client = mqtt.connect({host: 'test.mosquitto.org', port: 8080});
 
    // called when the client has connected to a broker
    client.on('connect', function () {
        client.subscribe('Tiles');
        client.publish('Tiles', 'Hello MQTT!');
    });
 
    // called when a message arrives
    client.on('message', function (topic, message) {
        var msgString = message.toString();
        console.log('MQTT: ['+topic+'] '+msgString);
        try {
            var json = JSON.parse(msgString);
            if (json) handleReceivedJson(json);
        } catch (exception) {
            console.log('JSON Parse Error: '+exception);
        }
    });

    function handleReceivedJson(json) {
        for (var i=0; i<$scope.devices.length; i++) {
            var device = $scope.devices[i];
            if (device.id == json.id) {
                device.ledOn = (json.activation == 'on');
                $scope.$apply();
                $scope.sendData(device);
            }
        }
    }
    
    $scope.devices = [
        /*{'name': 'TI SensorTag','id': '01:23:45:67:89:AB', 'rssi': -79, 'advertising': null},
        {'name': 'Some OtherDevice', 'id': 'A1:B2:5C:87:2D:36', 'rssi': -52, 'advertising': null}*/
    ];

    var rfduino = {
        serviceUUID: '2220',
        receiveCharacteristic: '2221',
        sendCharacteristic: '2222',
        disconnectCharacteristic: '2223'
    };

    var arrayBufferToString = function(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    };

    var DataReceiver = function DataReceiver(device) {
        this.onData = function(data) { // Data received from RFduino
            var buttonValue = arrayBufferToString(data);
            var message = {
                from_id: device.id,
                type: 'button_event'
            };
            if (buttonValue === 'btnON') {
                device.buttonPressed = true;
                message.event = 'pressed';
            } else if (buttonValue === 'btnOFF') {
                device.buttonPressed = false;
                message.event = 'released';
            }
            $scope.$apply();
            client.publish('Tiles', JSON.stringify(message));
        }
    }

    var isNewDevice = function(discoveredDevice){
        for (var i=0; i<$scope.devices.length; i++) {
            if ($scope.devices[i].id == discoveredDevice.id) return false;
        }
        return true;
    }

    var app = {
        onDiscoverDevice: function(device) {
            device.connected = false;
            if (isNewDevice(device)) {
                $scope.devices.push(device);
            }
        },
        onError: function(reason) {
            alert('ERROR: ' + reason);
        }
    };

    $scope.sendData = function(device) { // Send data to RFduino
        var success = function() {
            console.log('Data sent successfully.');
        };

        var failure = function() {
            alert('Failed writing data to the RFduino');
        };

        var data = new Uint8Array(1);
        data[0] = device.ledOn ? 0x1 : 0x0;

        ble.writeWithoutResponse(device.id, rfduino.serviceUUID, rfduino.sendCharacteristic, data.buffer, success, failure);
    };

    $scope.doRefresh = function() {
        ble.scan([rfduino.serviceUUID], 5, app.onDiscoverDevice, app.onError);
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.connect = function(device) {
        ble.connect(device.id,
            function() {
                device.ledOn = false;
                device.connected = true;
                var receiver = new DataReceiver(device);
                ble.startNotification(device.id, rfduino.serviceUUID, rfduino.receiveCharacteristic, receiver.onData, app.onError);
                $scope.$apply();
            },
            function() {
                alert('Failure!')
            });
    };

    $scope.disconnect = function(device) {
        ble.disconnect(device.id,
            function() {
                device.connected = false;
                $scope.$apply();
            },
            function() {
                alert('Failure!')
            });
    };

}]);