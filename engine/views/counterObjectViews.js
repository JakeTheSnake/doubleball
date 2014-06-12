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

        getTabs: function() {
                return  '';
        },

        getStateForm: function(stateId) {
            return 'CONTENT FOR STATE ' + stateId;
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
        }
    };

    $.extend(GameCreator.CounterObjectText.prototype, counterObjectPrototypeFunctions);
    $.extend(GameCreator.CounterObjectImage.prototype, counterObjectPrototypeFunctions);
}());
