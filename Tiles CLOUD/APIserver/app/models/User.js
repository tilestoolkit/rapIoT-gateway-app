/**
 * Created by Jonas on 29.10.2015.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

module.exports=mongoose.model('User',new Schema({
    id:Number,
    name:String,
}));