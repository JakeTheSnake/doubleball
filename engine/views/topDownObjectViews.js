GameCreator.TopDownObject.prototype.getEvents = function() {
	return  '<li data-uifunction="setupOnClickActionsForm">On Click</li> \
			 <li data-uifunction="setupKeyEventsForm">On Keypress</li>';
};

GameCreator.TopDownObject.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-maxSpeed-container" class="form-item"> \
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

GameCreator.TopDownObject.prototype.getSceneObjectForm = function() {
var result = ' \
<div class="panel-paragraph border-bottom"> \
    <h1 id="scene-object-property-instanceId" data-inputtype="stringInput"></h1> \
    <p></p> \
</div> \
<div class="panel-paragraph properties-group border-bottom"> \
    <div class="properties-value"> \
        <label>Position</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="scene-object-property-x" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="scene-object-property-y" data-inputtype="numberInput"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Size</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>W:</td> \
                <td id="scene-object-property-width" data-inputtype="rangeInput"></td> \
            </tr> \
            <tr> \
                <td>H:</td> \
                <td id="scene-object-property-height" data-inputtype="rangeInput"></td> \
            </tr> \
        </table> \
    </div> \
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Max Speed</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Val:</td> \
                <td id="scene-object-property-maxSpeed" data-inputtype="rangeInput"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};
