import { Events, NavController, NavParams, Content} from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';

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

  constructor(private events: Events,
              public navCtrl: NavController, 
  						public navParams: NavParams,
              private mqttClient: MqttClient,
              private utils: UtilsService) {

    this.messages = [];

    //  THIS IS REALLY REALLY BAD, BUT JUST FOR TESTING
    for (var i = 0; i < 20; i++) {
      this.messages.push({'text': 'test', 'datetime': this.currentTime()});
    }

    this.events.subscribe('serverConnected', () => {
    	console.log('broker connected')
    	this.addNewMessage('Connected to MQTT-broker');
    });

    this.events.subscribe('offline', () => {
    	console.log('broker offline')
      this.addNewMessage('MQTT-broker offline');
    });

    this.events.subscribe('close', () => {
      this.addNewMessage('Closed connection to MQTT-broker');
    });

    this.events.subscribe('reconnect', () => {
    	console.log('reconnecting')
      this.addNewMessage('MQTT-broker reconnecting');
    });

	  this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
    	console.log('sending command')
	  	const message = `Sending message to BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(command)}`;
      this.addNewMessage(message);
    });

    this.events.subscribe('recievedEvent', (deviceId: string, event: CommandObject) => {
    	console.log('recieved event')
	  	const message = `Recieved event from BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(event)}`;
			this.addNewMessage(message);
    });
  }

  ionViewDidEnter() {
    this.jumpBottomOfList();
  }

  addNewMessage = (message) => {
    this.messages.push({'text': message, 'datetime': this.currentTime()});
    this.scrollBottomOfList();
  }

  clearTerminal = () => {
    this.messages = [];
  }

  scrollBottomOfList = () => {
    // Check if scrolled to bottom of list
    if (this.getListLocation() === 0) {
      // Need a delay so the list can update before scrolling down
      setTimeout(() => {
        this.content.scrollToBottom(50);
      }, 10);
    }
  }

  jumpBottomOfList = () => {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 10);
  }

  getListLocation = () => {
    let dim = this.content.getContentDimensions();
    let distanceToBottom = dim.scrollHeight - (dim.contentHeight + dim.scrollTop);
    console.log(distanceToBottom);

    return distanceToBottom;
  }

  currentTime = () => {
    var date = new Date(); 
    var datetime = date.getHours() + ':' +
                   date.getMinutes() + ':' +
                   date.getSeconds();
    return datetime;
  }


}
