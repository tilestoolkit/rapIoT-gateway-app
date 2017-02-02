import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    Tiles,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(Tiles)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Tiles,
    HomePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
