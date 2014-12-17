GameCreator.PlatformObject.prototype.getEvents = function() {
	return  '<li data-uifunction="setupOnClickActionsForm"><i class="icon-codeopen" /><span>On Click</span></li> \
			 <li data-uifunction="setupKeyEventsForm"><i class="icon-codeopen" /><span>On Keypress</span></li>';
};

GameCreator.PlatformObject.prototype.getPropertiesForm = function() {
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
    <div id="object-property-acceleration-container" class="form-item"> \
    </div> \
</div>\
<div class="form-group"> \
    <div id="object-property-accY-container" class="form-item"> \
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

GameCreator.PlatformObject.prototype.getSceneObjectForm = function() {
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
            <span class="icon-down-dir">Speed and Acceleration</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Speed Limit:</td> \
                        <td id="side-property-maxSpeed" data-inputtype="rangeInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Acceleration:</td> \
                        <td id="side-property-acceleration" data-inputtype="numberInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Physics</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Gravity:</td> \
                        <td id="side-property-accY" data-inputtype="numberInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
    </ul>'

    return result;
};

