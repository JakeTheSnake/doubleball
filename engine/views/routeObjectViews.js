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

    GameCreator.RouteObject.prototype.getPropertiesForm = function(stateId) {
        var result = ' \
<div class="form-group"> \
    <div id="object-property-width-container" class="form-item"> \
    </div> \
    <div id="object-property-height-container" class="form-item"> \
    </div> \
</div> \
<div class="form-group"> \
    <div id="object-property-speed-container" class="form-item"> \
    </div> \
</div>\
<div class="panel-paragraph"> \
    <h2>Set default graphic</h2> \
    <div class="form-group"> \
        <div id="object-property-image-container" class="form-item"> \
        </div> \
    </div> \
</div>';
        return result;
    };


}());

