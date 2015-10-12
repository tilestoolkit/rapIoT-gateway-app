/**
 * Created by Jonas on 12.10.2015.
 */
var TileParse=function(str){
    this.data=JSON.parse(str);

    if(this.data.hasOwnProperty('FromId') &&
        this.data.hasOwnProperty('Type') &&
        this.data.hasOwnProperty('Event')) {
        this.id = this.data.FromId;
        this.type = this.data.Type;
        this.event=this.data.Event;
    }
    else
        throw new Error("Illegal format for sent data");

};

TileParse.prototype.getId=function(){
    return this.id;
};

TileParse.prototype.getType=function(){
    return this.type;
};

TileParse.prototype.getEvent=function(){
  return this.event;
};

module.exports=TileParse;