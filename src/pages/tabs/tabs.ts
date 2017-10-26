import { Component } from '@angular/core';

import { ApplicationsPage } from '../applications/applications';
import { DevTermPage } from '../dev-term/dev-term';
import { PhysicalTilesPage } from '../physical-tiles/physical-tiles';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public rootPage: any = ApplicationsPage;
  public physicalPage: any = PhysicalTilesPage;
  public devPage: any = DevTermPage;

  constructor() { } // tslint:disable-line
}

export default { TabsPage };
