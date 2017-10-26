/*
  This file contains a provider for a simple logger that keeps
  trach of events in the app.
*/

import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { LogEntry, UtilsService } from './utils.service';


@Injectable()
export class Logger {
  public log: LogEntry[];

  constructor(public events: Events,
              private utils: UtilsService) {
    this.log = [];
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
