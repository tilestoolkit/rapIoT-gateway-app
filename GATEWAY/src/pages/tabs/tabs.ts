import { Component } from '@angular/core';

import { ApplicationsPage } from '../applications/applications';
import { PhysicalTilesPage } from '../physical-tiles/physical-tiles';
import { DevTermPage } from '../dev-term/dev-term';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  rootPage: any = ApplicationsPage;
  physicalPage: any = PhysicalTilesPage;
  devPage: any = DevTermPage;

  constructor() {

  }
}

export default { TabsPage }
