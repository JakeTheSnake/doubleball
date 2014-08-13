GameCreator.FreeObject.prototype.getEvents = function() {
	return  '<li data-uifunction="setupOnClickActionsForm">On Click</li>';
};

GameCreator.FreeObject.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-speedX-container" class="form-item"> \
    </div> \
    <div id="object-property-speedY-container" class="form-item"> \
    </div> \
</div>\
<div class="form-group"> \
    <div id="object-property-accX-container" class="form-item"> \
    </div> \
    <div id="object-property-accY-container" class="form-item"> \
    </div> \
</div> \
<div class="panel-paragraph"> \
    <h2>Set default graphic</h2> \
    <div class="form-group"> \
        <div id="object-property-image-container" class="form-item"> \
        </div> \
    </div> \
</div>';
    return result;
};

