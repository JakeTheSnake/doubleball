(function() {
    "use strict";

    var counterObjectPrototypeFunctions = {
        getNonStatePropertiesForm: function() {
                return  '';
        },

        getEvents: function() {
                return  '';
        },

        getEditWindow: function() {
            var result = "";

            result += '<div id="dialogue-window-title">Edit object</div> \
                       <div id="dialogue-window-menu"> \
                       <a class="tab dialogue-window-tab active" data-uifunction="setupPropertiesForm"><i class="icon-codeopen" /><span>Properties</span></a>';

            result += this.getTabs();
            result +=  '<a class="tab dialogue-window-tab" data-uifunction="setupStatesColumn"><i class="icon-codeopen" /><span>States</span></a>';
            result +=  '</div><div id="edit-global-object-window-content"></div>';

            return result;
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
    <div id="object-property-size-container" class="form-item"> \
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

GameCreator.CounterObjectText.prototype.getSceneObjectForm = function() {
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
</div>'
return result;
};

GameCreator.CounterObjectImage.prototype.getSceneObjectForm = function() {
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
        </table> \
        <table> \
            <tr> \
                <td>H:</td> \
                <td id="side-property-height" data-inputtype="rangeInput"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};

}());
