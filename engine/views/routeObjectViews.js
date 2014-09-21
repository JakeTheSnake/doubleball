(function() {
    "use strict";
    
    GameCreator.RouteObject.prototype.getEvents = function() {
        return  '<li data-uifunction="setupOnClickActionsForm"><i class="icon-codeopen" /><span>On Click</span></li>';
    };

    GameCreator.RouteObject.prototype.getPropertiesForm = function() {
        var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-speed-container" class="form-item"> \
    </div> \
</div>\
<div class="panel-paragraph"> \
    <h2>Set default graphic</h2> \
    <div class="form-group"> \
        <div id="object-property-image-container" class="form-item"> \
        </div> \
    </div> \
</div>';
        return result;
    };


}());

