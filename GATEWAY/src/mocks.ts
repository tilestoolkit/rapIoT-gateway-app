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
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
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
  public get(str: string): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public set(any1: any, any2: any): any {
    return true;
  }
}

export class BackgroundFetchMock {
  public configure(): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class BLEMock {
  public isEnabled(): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public enable(): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public scan(): Observable<any> {
    return Observable.of();
  }
  public catch(args): Promise<any> {
    return new Promise((resolve: Function) => {
      return resolve();
    });
  }
}