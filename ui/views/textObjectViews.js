(function() {
    "use strict";

    GameCreator.TextObject.prototype.getNonStatePropertiesForm = function() {
        return  '';
    },

    GameCreator.TextObject.prototype.getEvents = function() {
        return  '';
    },

    GameCreator.TextObject.prototype.getTabs = function() {
        return '<li data-uifunction="setupPropertiesForm"><i class="icon-codeopen" /><span>Properties</span></li> \
        <li data-uifunction="setupStatesColumn"><i class="icon-codeopen" /><span>States</span></li>'
    };

    GameCreator.TextObject.prototype.getPropertiesForm = function() {
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
</div> \
<div class="form-group"> \
    <div id="object-property-text-container" class="form-item"> \
    </div> \
</div>';
    return result;
    };

GameCreator.TextObject.prototype.getSceneObjectForm = function() {
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
</div> \
<div class="panel-paragraph properties-group"> \
    <div class="properties-value"> \
        <label>Text</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Text:</td> \
                <td id="side-property-text" data-inputtype="stringInput"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
    return result;
    };

}());
