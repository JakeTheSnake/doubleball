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
        <div id="global-object-image-upload-controls"></div> \
    </div> \
</div>';
    return result;
};

GameCreator.MouseObject.prototype.getSceneObjectForm = function() {
var result = ' \
    <ul class="nav nav-stacked nav-tabs nav-tabs-success form-container"> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Size and Position</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Width:</td> \
                        <td id="side-property-width" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Height:</td> \
                        <td id="side-property-height" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Position X:</td> \
                        <td id="side-property-x" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Position Y:</td> \
                        <td id="side-property-y" data-inputtype="numberInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Boundaries</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Min X:</td> \
                        <td id="side-property-minX" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Min Y:</td> \
                        <td id="side-property-minY" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Max X:</td> \
                        <td id="side-property-maxX" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Max Y:</td> \
                        <td id="side-property-maxY" data-inputtype="numberInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
    </ul>'

    return result;
};
