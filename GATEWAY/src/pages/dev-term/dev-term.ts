import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { MqttClient } from '../../providers/mqttClient';
import { CommandObject, UtilsService } from '../../providers/utils.service';

/*
  Generated class for the DevTerm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dev-term',
  templateUrl: 'dev-term.html'
})
export class DevTermPage {
  messages: string[];

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private mqttClient: MqttClient,
              private utils: UtilsService, ) {
    this.messages = [];

    this.events.subscribe('serverConnected', () => {
      console.log('broker connected');
      this.messages.push('Connected to MQTT-broker');
    });

    this.events.subscribe('offline', () => {
      console.log('broker offline');
      this.messages.push('MQTT-broker offline');
    });

    this.events.subscribe('close', () => {
      this.messages.push('Closed connection to MQTT-broker');
    });

    this.events.subscribe('reconnect', () => {
      console.log('reconnecting');
      this.messages.push('MQTT-broker reconnecting');
    });

    this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
      console.log('sending command');
      const message = `Sending message to BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(command)}`;
      this.messages.push(message);
    });

    this.events.subscribe('recievedEvent', (deviceId: string, event: CommandObject) => {
      console.log('recieved event');
      const message = `Recieved event from BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(event)}`;
      this.messages.push(message);
    });
  }
}
