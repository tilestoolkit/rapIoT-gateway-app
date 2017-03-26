import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Content} from 'ionic-angular';

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
 @ViewChild(Content) content: Content;
  messages = [];
  messageDate = [];

  constructor(private events: Events,
              public navCtrl: NavController, 
  						public navParams: NavParams,
              private mqttClient: MqttClient,
              private utils: UtilsService) {

//     angular.module('ionicApp', ['ionic']).config(function($ionicConfigProvider) {
//   if (!ionic.Platform.isIOS()) {
//     $ionicConfigProvider.scrolling.jsScrolling(false);
//   }
// })

    //  THIS IS REALLY REALLY BAD, BUT JUST FOR TESTING
  	this.messages = [];
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());
    this.messages.push('test');
    this.messageDate.push(this.currentTime());

    this.events.subscribe('serverConnected', () => {
    	console.log('broker connected')
    	this.messages.push('Connected to MQTT-broker');
      this.messageDate.push(this.currentTime());
    });

    this.events.subscribe('offline', () => {
    	console.log('broker offline')
    	this.messages.push('MQTT-broker offline');
      this.messageDate.push(this.currentTime());
    });

    this.events.subscribe('close', () => {
    	this.messages.push('Closed connection to MQTT-broker');
      this.messageDate.push(this.currentTime());
    });

    this.events.subscribe('reconnect', () => {
    	console.log('reconnecting')
    	this.messages.push('MQTT-broker reconnecting');
      this.messageDate.push(this.currentTime());
    });

	  this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
    	console.log('sending command')
	  	const message = `Sending message to BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(command)}`;
			this.messages.push(message);
      this.messageDate.push(this.currentTime());
    });

    this.events.subscribe('recievedEvent', (deviceId: string, event: CommandObject) => {
    	console.log('recieved event')
	  	const message = `Recieved event from BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(event)}`;
			this.messages.push(message);
      this.messageDate.push(this.currentTime());
    });
  }

  scrollBottom = () => {
    this.content.scrollToBottom(100);
  }

  clearTerminal = () => {
    this.messages = [];
    this.messageDate = [];
  }

  currentTime = () => {
    return  String(new Date(new Date().getTime()));
  }

}
