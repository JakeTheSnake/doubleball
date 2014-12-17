(function() {
    "use strict";

    var counterObjectPrototypeFunctions = {
        getNonStatePropertiesForm: function() {
                return  '';
        },

        getEvents: function() {
                return  '';
        },

        getTabs: function() {
            return '<li data-uifunction="setupPropertiesForm"><i class="icon-codeopen" /><span>Properties</span></li> \
            <li data-uifunction="setupStatesColumn"><i class="icon-codeopen" /><span>States</span></li>'
        },

    };


    $.extend(GameCreator.CounterObjectText.prototype, counterObjectPrototypeFunctions);
    $.extend(GameCreator.CounterObjectImage.prototype, counterObjectPrototypeFunctions);

    GameCreator.CounterObjectText.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-font-container" class="form-item"> \
    </div> \
    <div id="object-property-size-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-color-container" class="form-item"> \
    </div> \
</div>';

    return result;
    };

    GameCreator.CounterObjectImage.prototype.getPropertiesForm = function() {
    var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
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

GameCreator.CounterObjectText.prototype.getSceneObjectForm = function() {
var result = ' \
    <ul class="nav nav-stacked nav-tabs nav-tabs-success form-container"> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Position</span> \
            <table> \
                <tbody> \
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
            <span class="icon-down-dir">Appearance</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Font:</td> \
                        <td id="side-property-font" data-inputtype="stringInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Font Size:</td> \
                        <td id="side-property-size" data-inputtype="numberInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Color:</td> \
                        <td id="side-property-color" data-inputtype="stringInput"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
        <li class="condition-parameters"> \
            <span class="icon-down-dir">Target</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Object:</td> \
                        <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Counter:</td> \
                        <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput"  data-dependancy="counterCarrier"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
    </ul>'

    return result;
};

GameCreator.CounterObjectImage.prototype.getSceneObjectForm = function() {
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
            <span class="icon-down-dir">Target</span> \
            <table> \
                <tbody> \
                    <tr> \
                        <td>Object:</td> \
                        <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
                    </tr> \
                    <tr> \
                        <td>Counter:</td> \
                        <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput" data-dependancy="counterCarrier"></td> \
                    </tr> \
                </tbody> \
            </table> \
        </li> \
    </ul>'

    return result;
};

}());
