import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { CommandObject, LogEntry, UtilsService } from './utils.service';


@Injectable()
export class Logger {
  public log: LogEntry[];

  constructor(public events: Events,
              private utils: UtilsService) {
    this.log = [];

    // Listen to various events in the application and store them in the log
    this.events.subscribe('serverConnected', () => {
      this.addToLog('Connected to MQTT-broker');
    });
    this.events.subscribe('offline', () => {
      this.addToLog('MQTT-broker offline');
    });
    this.events.subscribe('error', () => {
      this.addToLog('MQTT-error occured');
    });
    this.events.subscribe('close', () => {
      this.addToLog('Closed connection to MQTT-broker');
    });
    this.events.subscribe('reconnect', () => {
      this.addToLog('MQTT-broker reconnecting');
    });
    this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
      const message = `Got message from cloud to device: ${deviceId} \n ${this.utils.getCommandObjectAsString(command)}`;
      this.addToLog(message);
    });
    this.events.subscribe('recievedEvent', (deviceId: string, event: CommandObject) => {
      const message = `Recieved event from BLE device: ${deviceId} : ${this.utils.getCommandObjectAsString(event)}`;
      this.addToLog(message);
    });
  }

  /**
   * Add a message to the log with timestamp
   * @param {logEntry} logEntry - a string to add to the log
   */
  public addToLog = (message: string): void => {
    const date = new Date();
    const timestamp = date.getHours() + ':' +
                    date.getMinutes() + ':' +
                    date.getSeconds();
    this.log.push(new LogEntry(message, timestamp));
    // Notify the rest of the app of the new log entry
    this.events.publish('logUpdate');
  }

  /**
   * Return the entire log from it was last cleared
   */
  public getLog = (): LogEntry[] => {
    return this.log;
  }

  /**
   * Remove all messages in the log
   */
  public clearLog = (): void => {
    this.log = [];
  }
}
