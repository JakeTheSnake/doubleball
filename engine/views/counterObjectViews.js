(function() {
    "use strict";

    var sceneObjectFormFunction = function(sceneObject, counterCarriers) {
        var result = '<div id="edit-scene-object-form">';
        result += '<div id="add-counter-object-counter-selector">' + 
            GameCreator.htmlStrings.inputLabel('add-counter-counter-object', 'Object') +
            GameCreator.htmlStrings.singleSelector('add-counter-counter-object', counterCarriers, 'counterObject', sceneObject.counterObject) +
            '<div id="counter-list-content"></div>' +
            '</div>' + 
            '<br style="clear:both;"/>';
        result += GameCreator.helpers.getAttributeForm(GameCreator[sceneObject.parent.objectType].objectSceneAttributes,
            GameCreator[sceneObject.parent.objectType].objectAttributes,
            sceneObject);
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    };

    GameCreator.CounterObjectText.sceneObjectForm = sceneObjectFormFunction;
    GameCreator.CounterObjectImage.sceneObjectForm = sceneObjectFormFunction;

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
                       <a class="tab dialogue-window-tab active" data-uifunction="setupPropertiesForm">Properties</a>';

            result += this.getTabs();
            result +=  '<a class="tab dialogue-window-tab" data-uifunction="setupStatesForm">States</a>';
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
        <label>Font</label> \
        <span class="glyphicon icon-position"></span> \
        <table> \
            <tr> \
                <td>Name:</td> \
                <td id="scene-object-property-font" data-inputtype="stringInput"></td> \
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
                <td id="scene-object-property-size" data-inputtype="numberInput"></td> \
            </tr> \
            <tr> \
                <td>Color:</td> \
                <td id="scene-object-property-color" data-inputtype="stringInput"></td> \
            </tr> \
        </table> \
    </div> \
</div>'
return result;
};
}());
