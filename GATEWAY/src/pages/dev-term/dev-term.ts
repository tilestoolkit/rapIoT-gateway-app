import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, Events, NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';

import { Logger } from '../../providers/logger.service';
import { LogEntry } from '../../providers/utils.service';


@Component({
  selector: 'page-dev-term',
  templateUrl: 'dev-term.html',
})
export class DevTermPage {
  @ViewChild(Content) content: Content; // tslint:disable-line
  private messages: LogEntry[];
  private logUpdate: Subscription;


  constructor(public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private logger: Logger,
              private alertCtrl: AlertController) {
    this.events.subscribe('logUpdate', () => this.updateLog());
  }

  /**
   * Prompts user if sure to clear the terminal output.
   */
  public promptClearTerminal = (): void => {
    let confirm = this.alertCtrl.create({
      title: 'Clear terminal output?',
      message: 'Are you sure you want to clear the terminal output?', // tslint:disable-line
      buttons: [
        {
          text: 'Cancel',
          handler: () => { // tslint:disable-line
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Clear',
          handler: () => { // tslint:disable-line
            this.clearTerminal();
          },
        },
      ],
    });
    confirm.present();
  }

  /**
   * Clear the terminal messages
   */
  public clearTerminal = (): void => {
    this.messages = [];
    this.logger.clearLog();
  }

  /**
   * Scroll to the bottom of the list
   * @param {boolean} jump - True if we want to scroll even though the view is not at
   * the bottom
   */
  public scrollBottomOfList = (jump: boolean): void => {
    // Check if scrolled to bottom of list, or the jump button was pressed
    // otherwise we want the view to stay where it is
    if (this.getListLocation() === 0 || jump) {
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
    this.scrollBottomOfList(false);
    this.messages = this.logger.getLog();
    // Created a subscription to an observable which updates the log
    // every 0.5 seconds
    this.logUpdate = Observable.interval(500).subscribe(res => {
      this.updateLog();
    });
  }

  /**
   * called when the view enters
   */
  public ionViewWillLeave = (): void => {
    this.scrollBottomOfList(false);
    this.messages = this.logger.getLog();
    this.logUpdate = null;
  }

  /**
   * add a new message to the list
   */
  private updateLog = (): void => {
    this.messages = this.logger.getLog();
    this.scrollBottomOfList(false);
  }

  /**
   * Get the current list location
   */
  private getListLocation = (): number => {
    const dim = this.content.getContentDimensions();
    const distanceToBottom = dim.scrollHeight - (dim.contentHeight + dim.scrollTop);
    return distanceToBottom;
  }
}
