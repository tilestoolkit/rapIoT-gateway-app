import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the VirtualTiles page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// function for capitalizing a string 
var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

@Component({
  selector: 'page-virtual-tiles',
  templateUrl: 'virtual-tiles.html'
})
export class VirtualTilesPage {
	applicationTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	// A id variable is stored in the navParams, and .get set this value to the local variable id
  	let id = navParams.get('_id');

  	// Sets the title of the page (found in virtual-tiles.html) to id, capitalized. 
  	this.applicationTitle = capitalize(id);
  }
}