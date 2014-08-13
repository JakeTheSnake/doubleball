GameCreator.MouseObject.prototype.getEvents = function(){
	return  '<li data-uifunction="setupKeyEventsForm">On Keypress</li>';
};

GameCreator.MouseObject.prototype.getPropertiesForm = function(stateId) {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-minX-container" class="form-item"> \
    </div> \
    <div id="object-property-minY-container" class="form-item"> \
    </div> \
</div>\
<div class="form-group"> \
    <div id="object-property-maxX-container" class="form-item"> \
    </div> \
    <div id="object-property-maxY-container" class="form-item"> \
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

