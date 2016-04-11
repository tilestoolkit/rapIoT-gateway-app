var mongoose = require('mongoose');
var child_process = require('child_process');
var appProcesses = [];

var AppRecipeSchema = new mongoose.Schema({
    name: String,
    code: String,
    active: Boolean,
    user: {type: String, ref: 'User'}
});

AppRecipeSchema.methods.activate = function(callback) {
    var code = this.code;
    var args = [code];
    var options = {};

    var cp = child_process.fork('vm_exec', args, options);
    var that = this;

    cp.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
    });

    cp.on('close', function(code) {
        console.log('Child process exited with code: ' + code);
        that.active = false;
        that.save();
    });

    this.active = true;
    this.save(callback);

    appProcesses[this._id] = cp;
}

AppRecipeSchema.methods.deactivate = function(callback) {
    var process = appProcesses[this._id];
    if (process) process.kill();

    this.active = false;
    this.save(callback);
}

mongoose.model('AppRecipe', AppRecipeSchema);