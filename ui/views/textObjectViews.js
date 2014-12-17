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
                        <td>Text:</td> \
                        <td id="side-property-text" data-inputtype="stringInput"></td> \
                    </tr> \
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
    </ul>'

    return result;
};

}());
