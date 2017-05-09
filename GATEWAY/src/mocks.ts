import { Observable } from 'rxjs';

export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

export class FormMock {
  public register(): any {
    return true;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise((resolve: Function): void => {
      resolve();
    });
  }

  public push(): any {
    return new Promise((resolve: Function): void => {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }
}

export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class StorageMock {
  public get(val1: any): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public set(any1: any, any2: any): any {
    return true;
  }
}

export class BackgroundFetchMock {
  public configure(args): Promise<any> {
    return new Promise((resolve: Function) => {
      Promise.resolve();
    });
  }
  public start() {
    return true;
  }
  public stop() {
    return true;
  }
  public finish() {
    return true;
  }
}

export class BLEMock {
  public isEnabled(): any {
    return new Promise<void>((resolve: Function): void => {
      Promise.resolve();
    });
  }
  public enable(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Promise.resolve();
    });
  }
  public scan(): Observable<any> {
    return Observable.of();
  }
  public catch(args): Promise<any> {
    return new Promise((resolve: Function) => {
      Promise.resolve();
    });
  }
  public connect(): Observable<any> {
    return Observable.of();
  }
  public startNotification(val1: any, val2: any, val3: any): Observable<any> {
    return Observable.of();
  }
  public disconnect(args): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public writeWithoutResponse(args): Promise<any> {
    return new Promise((resolve: Function) => {
      Promise.resolve();
    });
  }
}

export class MqttMock {
  public connect(val1: any) {
    return true;
  }
  public on(val1: any, val2: any) {
    return true;
  }
  public end() {
    return true;
  }
  public publish(val1: any, val2: any, val3: any) {
    return true;
  }
  public subscribe(val1: any, val2: any) {
    return true;
  }
  public unsubscribe(val1: any, val2: any) {
    return true;
  }
}

export class NavParamsMock {

}

export class ViewControllerMock {

}

export class BackgroundModeMock {
  public configure(): Promise<any> {
    return new Promise((resolve: Function) => {
      Promise.resolve();
    });
  }
  public enable() {
    return true;
  }
  public stop() {
    return true;
  }
}

export class DiagnosticMock {
  public isLocationEnabled(): any {
    return true;
  }
}
