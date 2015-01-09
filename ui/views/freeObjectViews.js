GameCreator.FreeObject.prototype.getEvents = function() {
	return  '<li data-uifunction="setupOnClickActionsForm"><i class="icon-codeopen" /><span>On Click</span></li>';
};

GameCreator.FreeObject.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="panel-paragraph"> \
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

GameCreator.FreeObject.prototype.getSceneObjectForm = function() {
    var result = ' \
    <ul class="nav nav-stacked nav-tabs nav-tabs-success form-container"> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Size and Position</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Width:</td> \
                        <td id="side-property-width" data-inputtype="rangeInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Height:</td> \
                        <td id="side-property-height" data-inputtype="rangeInput"></td> \
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
                        <td>Speed X:</td> \
                        <td id="side-property-speedX" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Speed Y:</td> \
                        <td id="side-property-speedY" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Acceleration X:</td> \
                        <td id="side-property-accX" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Acceleration Y:</td> \
                        <td id="side-property-accY" data-inputtype="numberInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
    </ul>'

    return result;
};

