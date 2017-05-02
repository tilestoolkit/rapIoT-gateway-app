
import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Alert, AlertController, Events, Platform } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { DevicesService }from './devices.service';
import { MqttClient } from './mqttClient';
import { TilesApi  } from './tilesApi.service';
import { CommandObject, Device, UtilsService } from './utils.service';


@Injectable()
export class BleService {
  public bleScanner: Subscription;
  private rfduino = {
    disconnectCharacteristicUUID: '2223',
    receiveCharacteristicUUID: '2221',
    sendCharacteristicUUID: '2222',
    serviceUUID: '2220',
  };
  private errorAlert: Alert;

  constructor(private alertCtrl: AlertController,
              private diagnostic: Diagnostic,
              private events: Events,
              private platform: Platform,
              public ble: BLE,
              public devicesService: DevicesService,
              public mqttClient: MqttClient,
              public tilesApi: TilesApi,
              public utils: UtilsService) {
    this.errorAlert = this.alertCtrl.create({
      buttons: [{
        text: 'Dismiss',
      }],
      enableBackdropDismiss: true,
      subTitle: 'An error occured when trying to communicate to ' +
                      'the tile via Bluetooth Low Energy.',
      title: 'Bluetooth error',
    });
  }

  /**
   * Start the BLE scanner making it scan every 30s
   */
  public startBLEScanner = (): void => {
    this.scanForDevices();
    this.bleScanner = Observable.interval(10000).subscribe(res => {
      this.scanForDevices();
    });
  }

  /**
   * Stop the BLE scanner
   */
  public stopBLEScanner = (): void => {
    if (this.bleScanner !== undefined) {
      this.bleScanner.unsubscribe();
    }
  }

  /**
   * Checking if bluetooth is enabled and enable on android if not
   */
  public scanForDevices = (): void => {
    this.devicesService.clearDisconnectedDevices();
    this.ble.isEnabled().then( res => {
              if (!this.platform.is('ios')) {
                this.checkLocation();
              } else {
                this.scanBLE();
              }
            }).catch( err => {
              this.errorAlert.present();
              // NB! Android only!! IOS users has to turn bluetooth on manually
              if (!this.platform.is('ios')) {
                this.ble.enable().then( res => {
                    this.checkLocation();
                  }).catch( errEnable => {
                    console.log(errEnable);
                    this.errorAlert.present();
                  });
              }
            });
  }

  /**
   * Connect to a device
   * @param {Device} device - the target device
   */
  public connect = (device: Device): void => {
    this.ble.connect(device.id)
        .subscribe(
          res => {
            device.connected = true;
            this.startDeviceNotification(device);
            this.mqttClient.registerDevice(device);
          },
          err => {
            device.connected = false;
            this.devicesService.clearDisconnectedDevices();
            this.disconnect(device);
          });
  }

  /**
   * Connect and rename a device
   * @param {Device} device - the target device
   */
  public locate = (device: Device): void => {
    this.ble.connect(device.id)
        .subscribe(
          res => {
            this.sendData(device, 'led,on,red');
            setTimeout(() => {
              this.sendData(device, 'led,off');
              if (!device.connected) {
                this.disconnect(device);
              }
            }, 3000);
          },
          err => {
            this.errorAlert.present();
          });
  }

  /**
   * Disconnect from device
   * @param {Device} device - the target device
   */
  public disconnect = (device: Device): void => {
    this.ble.disconnect(device.id)
            .then( res => {
              device.connected = false;
              this.mqttClient.unregisterDevice(device);
              this.devicesService.clearDisconnectedDevices();
              console.log('diconnected from device: ' + device.name);
            })
            .catch( err => {
              console.log('Failed to disconnect');
            });
  }

  /**
   * Send data to a device using BLE
   * @param {Device} device - the target device
   * @param {string} dataString - the string of data to send to the device
   */
  public sendData = (device: Device, dataString: string): void => {
    try {
      const dataArray = this.utils.convertStringtoBytes(dataString);
      // Attempting to send the array of bytes to the device
      this.ble.writeWithoutResponse(device.id,
                               this.rfduino.serviceUUID,
                               this.rfduino.sendCharacteristicUUID,
                               dataArray.buffer)
              .then( res => console.log('Success sending the string: ' + dataString))
              .catch( err => {
                this.errorAlert.present();
              });
    } catch (err) {
      this.errorAlert.present();
    }
  }

  /**
   * Checking to see if any bluetooth devices are in reach
   */
  public scanBLE = (): void => {
    // A list of the discovered devices
    const virtualTiles = this.tilesApi.getVirtualTiles();
    this.ble.scan([], 5).subscribe(
      // function to be called for each new device discovered
      bleDevice => {
        if (this.tilesApi.isTilesDevice(bleDevice)) {
          this.devicesService.convertBleDeviceToDevice(bleDevice).then( device => {
            this.mqttClient.registerDevice(device);
            this.devicesService.newDevice(device);
            if (virtualTiles.filter(tile => tile.tile !== null)
                            .map(tile => tile.tile.name)
                            .includes(device.tileId)) {
              this.connect(device);
            }
          }).catch(err => this.errorAlert.present());
        }
      },
      err => {
        this.errorAlert.present();
      },
      () => {
        console.log('done scanning');
      });
  }

  /**
   * Start getting notifications of events from a device
   * @param {Device} device - the id from the target device
   */
  public startDeviceNotification = (device: Device): void => {
    this.ble.startNotification(device.id, this.rfduino.serviceUUID, this.rfduino.receiveCharacteristicUUID)
      .subscribe(
        res => {
          device.lastDiscovered = (new Date()).getTime();
          const responseString = ((String.fromCharCode.apply(null, new Uint8Array(res))).slice(0, -1)).trim();
          const message: CommandObject = this.utils.getEventStringAsObject(responseString);
          if (message === null) {
            console.log('Couldnt make an object from event: ' + responseString);
          } else {
            this.mqttClient.sendEvent(device.tileId, message);
            this.events.publish('recievedEvent', device.tileId, message);
          }
        },
        err => {
          this.errorAlert.present();
        },
        () => { // called when the device disconnects
          device.connected = false;
          this.devicesService.clearDisconnectedDevices();
          this.mqttClient.unregisterDevice(device);
        });
  }

  private checkLocation = () => {
    this.diagnostic.isLocationEnabled().then(diagnosticRes => {
        if (diagnosticRes) {
          this.scanBLE();
        } else {
          alert('Location is not activated, please activate it.');
          this.diagnostic.switchToLocationSettings();
        }
      });
  }
}
