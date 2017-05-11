import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Content } from 'ionic-angular';

import { MqttClient } from '../../providers/mqttClient';
import { CommandObject, UtilsService } from '../../providers/utils.service';


@Component({
  selector: 'page-dev-term',
  templateUrl: 'dev-term.html'
})
export class DevTermPage {
  @ViewChild(Content) content: Content;
  messages = [];

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private mqttClient: MqttClient,
              private utils: UtilsService) {

    this.messages = [];

    this.events.subscribe('serverConnected', () => {
      this.addNewMessage('Connected to MQTT-broker');
    });

    this.events.subscribe('offline', () => {
      this.addNewMessage('MQTT-broker offline');
    });

    this.events.subscribe('error', () => {
      this.addNewMessage('MQTT-error occured');
    });

    this.events.subscribe('close', () => {
      this.addNewMessage('Closed connection to MQTT-broker');
    });

    this.events.subscribe('reconnect', () => {
      this.addNewMessage('MQTT-broker reconnecting');
    });

    this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
      const message = `Got message from cloud to device: ${deviceId} \n ${this.utils.getCommandObjectAsString(command)}`;
      this.addNewMessage(message);
    });

    this.events.subscribe('recievedEvent', (deviceId: string, event: CommandObject) => {
      const message = `Recieved event from BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(event)}`;
      this.addNewMessage(message);
    });
  }

  /**
   * called when the view enters
   */
  ionViewDidEnter() {
    this.scrollBottomOfList();
  }

  /**
   * add a new message to the list
   */
  addNewMessage = (message) => {
    this.messages.push({'text': message, 'datetime': this.utils.currentTime()});
    this.scrollBottomOfList();
  }

  /**
   * Clear the terminal messages
   */
  clearTerminal = () => {
    this.messages = [];
  }

  /**
   * scroll to the bottom of the list
   */
  scrollBottomOfList = () => {
    // Check if scrolled to bottom of list
    if (this.getListLocation() === 0) {
      // Need a delay so the list can update before scrolling down
      setTimeout(() => {
        this.content.scrollToBottom(50);
      }, 10);
    }
  }

  /**
   * Get the current list location
   */
  getListLocation = () => {
    let dim = this.content.getContentDimensions();
    let distanceToBottom = dim.scrollHeight - (dim.contentHeight + dim.scrollTop);
    return distanceToBottom;
  }
}
