import { App, Config, Events } from 'ionic-angular';
import { inject, TestBed, async } from '@angular/core/testing';
import { LogEntry, UtilsService } from './utils.service';
import { Logger } from './logger.service';
import { Storage } from '@ionic/storage';
import { StorageMock } from '../mocks';

describe('logger', () => {

  let logger: Logger = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        UtilsService,
        Logger,
        {
          provide: Storage,
          useClass: StorageMock
        },
      ],
    });
  });

  beforeEach( inject([Logger], (temp: Logger) => {
    logger = temp;
  }));

  afterEach(() => {
    logger = null;
  });

  it("should create an instance of the Logger", () => {
    expect(logger).toBeTruthy;
  });

  describe("addToLog(message)", () => {

    it("should add a message to the log with the correct timestamp", () => {
      let exampleMessage: string = "this is test";
      logger.addToLog(exampleMessage);

      expect(logger.log[0].message).toEqual(exampleMessage);
    });
  });

  describe("clearLog()", () => {
    it("should clear the log of all entries", () => {
      let exampleMessage1: string = "this is test";
      let exampleMessage2: string = "this is another test";
      logger.addToLog(exampleMessage1);
      logger.addToLog(exampleMessage2);
      logger.clearLog();

      expect(logger.getLog().length).toEqual(0);
    });
  });
});
