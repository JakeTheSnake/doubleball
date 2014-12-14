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
<div class="panel-paragraph border-bottom"> \
    <h1 id="side-property-instanceId-title"></h1> \
    <span>Instance of <span id="side-property-instanceOf"></span></span> \
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
        <label>Font</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Name:</td> \
                <td id="side-property-font" data-inputtype="stringInput"></td> \
            </tr> \
        </table> \
    </div> \
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Style</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Size:</td> \
                <td id="side-property-size" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Color:</td> \
                <td id="side-property-color" data-inputtype="stringInput"></td> \
            </tr> \
        </table> \
    </div> \
    <div class="properties-value"> \
        <label>Counter</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Object:</td> \
                <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
            </tr> \
            <tr> \
                <td>Counter:</td> \
                <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput" data-dependancy="counterCarrier"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};

GameCreator.CounterObjectImage.prototype.getSceneObjectForm = function() {
var result = ' \
<div class="panel-paragraph border-bottom"> \
    <h1 id="side-property-instanceId-title"></h1> \
    <span>Instance of <span id="side-property-instanceOf"></span></span> \
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
        </table> \
        <table> \
            <tr> \
                <td>H:</td> \
                <td id="side-property-height" data-inputtype="rangeInput"></td> \
            </tr> \
        </table> \
    </div> \
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Counter</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Obj:</td> \
                <td id="side-property-counterCarrier" data-inputtype="counterCarrierInput"></td> \
            </tr> \
            <tr> \
                <td>Ctr:</td> \
                <td id="side-property-counterName" data-inputtype="sceneObjectCounterInput" data-dependancy="counterCarrier"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};

}());
