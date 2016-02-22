const vm = require('vm');
const TilesClient = require('../../Tiles\ CLIENTS/js/tiles-client.js');

const sandbox = {
	TilesClient: TilesClient
};

var code = process.argv[2];
var options = {};
var script = new vm.Script(code, options);
script.runInNewContext(sandbox);
