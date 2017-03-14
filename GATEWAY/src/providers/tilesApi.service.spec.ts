import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { Device } from './devices.service';
import { TilesApi } from './tilesApi.service';

describe('tilesAPI', () => {

  let tilesApi: TilesApi = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide : Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        Device,
        Storage,
        TilesApi
      ]
    });
  });

  it('should make an instance of the TilesApi', inject([TilesApi], (temp: TilesApi) => {
    tilesApi = temp;
    expect(tilesApi).toBeTruthy;
  }));

});