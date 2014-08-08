(function() {
    "use strict";

    var sceneObjectFormFunction = function(sceneObject, counterCarriers) {
        var result = '<div id="edit-scene-object-form">';
        var state = sceneObject.parent.getState(sceneObject.currentState);        
        result += GameCreator.helpers.getAttributeForm(state.attributes,
                GameCreator[sceneObject.parent.objectType].objectSceneAttributes,
                sceneObject);
        result += '</div>';
        result += '<button id="edit-route-button" class="regularButton">Edit Route</button><br/ >';
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    };

    GameCreator.RouteObject.sceneObjectForm = sceneObjectFormFunction;

    GameCreator.RouteObject.prototype.getEvents = function() {
        return  '<li data-uifunction="setupOnClickActionsForm">On Click</li>';
    };
}());