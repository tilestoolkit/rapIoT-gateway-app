this["JST"] = this["JST"] || {};

this["JST"]["src/views/templates/tiles_sidebar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div class=\"tile\">\r\n            <div class=\"pure-u-1-4\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n            <div class=\"pure-u-1-4\"><a href=\"#"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" >Debug</a></div>\r\n            <div class=\"pure-u-1-4\">"
    + alias4(((helper = (helper = helpers.online || (depth0 != null ? depth0.online : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"online","hash":{},"data":data}) : helper)))
    + ((stack1 = container.invokePartial(partials.awsmRadio,depth0,{"name":"awsmRadio","hash":{"label":"","isChecked":true,"value":"radio{{id}}","id":"{{id}}","name":"{{name}}","type":"success"},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\r\n            <div class=\"pure-u-1-4\">"
    + alias4(((helper = (helper = helpers.inUse || (depth0 != null ? depth0.inUse : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inUse","hash":{},"data":data}) : helper)))
    + "</div>\r\n        </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"pure-g\" id=\"tiles-header\">\r\n    <div class=\"pure-u-1-4\">My Tiles</div>\r\n    <div class=\"pure-u-1-4\">Debug</div>\r\n    <div class=\"pure-u-1-4\">Online</div>\r\n    <div class=\"pure-u-1-4\">In use</div>\r\n</div>\r\n\r\n\r\n<div id=\"tiles\" class=\"pure-g\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.tiles : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"usePartial":true,"useData":true});