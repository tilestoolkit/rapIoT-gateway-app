import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PhysicalTilesPage } from '../physical-tiles/physical-tiles';
import { DevTermPage } from '../dev-term/dev-term';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  rootPage: any = HomePage;
  physicalPage: any = PhysicalTilesPage;
  devPage: any = DevTermPage;

  constructor() {

  }
}

export default { TabsPage }
