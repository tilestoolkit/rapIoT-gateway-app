'use strict';

/* Controllers */

angular.module('tiles.controllers', [])

.controller('TilesCtrl', ['$scope', '$ionicPopup', function($scope, $ionicPopup) {

    var client;
    var serverConnectionTimeout = 10000; // 10 seconds
    var publishOpts = {retain: true};

    $scope.mqttBroker = {
        host: '192.168.1.2',
        port: 8080
    }

    $scope.connectedToServer = false;
    $scope.serverConnectStatusMsg = "Click to connect to server";
    
    $scope.tilesApi = {
        username: 'TestUser'
    }

    $scope.showConnectMQTTPopup = function() {
        var serverConnectionPopup = $ionicPopup.show({
            template: 'Username:<input type="text" ng-model="tilesApi.username">Host:<input type="text" ng-model="mqttBroker.host">Port:<input type="number" ng-model="mqttBroker.port">',
            title: 'Connect to MQTT broker',
            subTitle: 'Enter username, host address and port number',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Connect</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (client) {
                        // End previous server connection
                        client.end();
                        $scope.connectedToServer = false;
                    }
                    
                    // Connect to MQTT server/broker
                    client = mqtt.connect({
                        host: $scope.mqttBroker.host,
                        port: $scope.mqttBroker.port
                    });

                    $scope.serverConnectStatusMsg = "Connecting...";

                    setTimeout(function() {
                        if (!$scope.connectedToServer) {
                            setServerConnectionStatus('Failed to connect to server', false);
                        }
                    }, serverConnectionTimeout)

                    // Called when the client has connected to a broker
                    client.on('connect', function() {
                        setServerConnectionStatus('Connected to ' + $scope.mqttBroker.host + ':' + $scope.mqttBroker.port, true);
                        if (typeof device !== 'undefined') client.publish('client', 'Device: ' + device.model + ' (' + device.uuid + ')', publishOpts);
                        else client.publish('client', 'Unknown device', publishOpts);
                    });

                    // Called when a message arrives
                    client.on('message', function(topic, message) {
                        var msgString = message.toString();
                        console.log('MQTT: [' + topic + '] ' + msgString);
                        try {
                            var json = JSON.parse(msgString);
                            if (json) handleReceivedJson(topic.split('/')[2], json);
                        } catch (exception) {
                            console.log('JSON Parse Error: ' + exception);
                        }
                    });

                    client.on('offline', function() {
                        setServerConnectionStatus('Client gone offline', false);
                    });

                    client.on('close', function() {
                        setServerConnectionStatus('Disconnected from server', false);
                    });

                    client.on('reconnect', function() {
                        setServerConnectionStatus('A reconnect is started', false);
                    });

                    client.on('error', function(error) {
                        console.log('Error: '+error);
                    });
                }
            }]
        });
    };

    function getDeviceSpecificTopic(deviceId, isEvent){
        var type = isEvent ? 'evt' : 'cmd';
        return 'tiles/' + type + '/' + $scope.tilesApi.username + '/' + deviceId;
    }

    function setServerConnectionStatus(msg, connected){
        console.log(msg);
        $scope.serverConnectStatusMsg = msg;
        $scope.connectedToServer = connected;
        $scope.$apply();
    }

    function handleReceivedJson(deviceId, json) {
        for (var i = 0; i < $scope.devices.length; i++) {
            var device = $scope.devices[i];
            if (device.id == deviceId) {
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
            if (client) client.publish(getDeviceSpecificTopic(device.id, true), JSON.stringify(message), publishOpts);
        }
    }

    var isNewDevice = function(discoveredDevice) {
        for (var i = 0; i < $scope.devices.length; i++) {
            if ($scope.devices[i].id == discoveredDevice.id) return false;
        }
        return true;
    }

    var app = {
        onDiscoverDevice: function(device) {
            console.log('Device discovered: '+device);
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
        // Scan for devices if Bluetooth is enabled.
        // Otherwise, prompt the user to enable Bluetooth.
        ble.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
                ble.scan([], 5, app.onDiscoverDevice, app.onError); // Scan for devices
            },
            function() {
                console.log("Bluetooth is NOT enabled");
                ble.enable(function() {
                    console.log("Bluetooth has been enabled");
                }, function() {
                    console.log("Bluetooth is still NOT enabled");
                });
            }
        );

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
                if (client) {
                    client.publish(getDeviceSpecificTopic(device.id, true)+'/active', 'true', publishOpts);
                    client.subscribe(getDeviceSpecificTopic(device.id, false));
                }
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
                if (client) {
                    client.publish(getDeviceSpecificTopic(device.id, true)+'/active', 'false', publishOpts);
                    client.unsubscribe(getDeviceSpecificTopic(device.id, false));
                }
            },
            function() {
                alert('Failure!')
            });
    };

}]);