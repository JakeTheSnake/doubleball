GameCreator.MouseObject.prototype.getEvents = function(){
	return  '<li data-uifunction="setupKeyEventsForm"><i class="icon-codeopen" /><span>On Keypress</span></li>';
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

GameCreator.MouseObject.prototype.getSceneObjectForm = function() {
var result = ' \
<div class="panel-paragraph border-bottom"> \
    <h1 id="side-property-instanceId" data-inputtype="stringInput"></h1> \
    <p></p> \
</div> \
<div class="panel-paragraph properties-group border-bottom"> \
    <div class="properties-value"> \
        <label>Position</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="side-property-x" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="side-property-y" data-inputtype="numberInput"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Size</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>W:</td> \
                <td id="side-property-width" data-inputtype="rangeInput"></td> \
            </tr> \
            <tr> \
                <td>H:</td> \
                <td id="side-property-height" data-inputtype="rangeInput"></td> \
            </tr> \
        </table> \
    </div> \
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Boundary Max</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="side-property-maxX" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="side-property-maxY" data-inputtype="numberInput"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Boundary Min</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>X:</td> \
                <td id="side-property-minX" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Y:</td> \
                <td id="side-property-minY" data-inputtype="numberInput"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};
