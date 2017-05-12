import { Component, ViewChild } from '@angular/core';
import { Content, Events, NavController, NavParams } from 'ionic-angular';

import { Logger } from '../../providers/logger.service';
import { LogEntry } from '../../providers/utils.service';


@Component({
  selector: 'page-dev-term',
  templateUrl: 'dev-term.html',
})
export class DevTermPage {
  @ViewChild(Content) content: Content; // tslint:disable-line
  private messages: LogEntry[];

  constructor(public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private logger: Logger) {
    this.events.subscribe('logUpdate', () => this.updateLog());
  }

  /**
   * Clear the terminal messages
   */
  public clearTerminal = (): void => {
    this.messages = [];
    this.logger.clearLog();
  }

  /**
   * scroll to the bottom of the list
   */
  public scrollBottomOfList = (): void => {
    // Check if scrolled to bottom of list
    if (this.getListLocation() === 0) {
      // Need a delay so the list can update before scrolling down
      setTimeout(() => {
        this.content.scrollToBottom(50);
      }, 10);
    }
  }

  /**
   * called when the view enters
   */
  public ionViewDidEnter = (): void => {
    this.scrollBottomOfList();
    this.messages = this.logger.getLog();
  }

  /**
   * add a new message to the list
   */
  private updateLog = (): void => {
    this.messages = this.logger.getLog();
    this.scrollBottomOfList();
  }

  /**
   * Get the current list location
   */
  private getListLocation = (): number => {
    let dim = this.content.getContentDimensions();
    let distanceToBottom = dim.scrollHeight - (dim.contentHeight + dim.scrollTop);
    return distanceToBottom;
  }
}
