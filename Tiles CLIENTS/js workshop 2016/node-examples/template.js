var WorkshopClient = require('../workshop-client');

var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();
var HueClient = new WorkshopClient.HueClient('PCz7eZwSifbpmLTQCdMVVvFEfC3MB7-odXvFAzC4');
var PostmanClient = new workshopClient.PostmanClient('192.168.1.6', 3000);
var IFTTTClient = new workshopClient.IFTTTClient('dncBS7n2aVGR4Bf44Yx9Ck');

var client = new TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new EventReader();

client.on('receive', function (tileId, event) {
	console.log(event);
	// WORK HERE!

});