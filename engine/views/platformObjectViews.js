GameCreator.PlatformObject.sceneObjectForm = function(sceneObject) {
    var result = '<div id="edit-scene-object-form">';
    result += GameCreator.htmlStrings.inputLabel("edit-platform-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-platform-object-height", "height", sceneObject.height);
    result += '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("edit-platform-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-platform-object-width", "width", sceneObject.width);
    result += '<br style="clear:both;"/>';
    result += GameCreator.PlatformObject.movementInputs(sceneObject);
    result += '<br style="clear:both;"/>';
    result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
    return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.PlatformObject.prototype.getTabs = function() {
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupKeyEventsForm">Keys</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupCountersForm">Counters</a>';
}

GameCreator.PlatformObject.movementInputs = function(object) {
    var result = GameCreator.htmlStrings.inputLabel("platform-object-accY", "Gravity:") +
        GameCreator.htmlStrings.rangeInput("platform-object-accY", "accY", (object ? object.accY : "")) +
        '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("platform-object-max-speed", "Speed:") +
        GameCreator.htmlStrings.rangeInput("platform-object-max-speed", "maxSpeed", (object ? object.maxSpeed : "")) +
        '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("platform-object-acceleration", "Acceleration:") +
        GameCreator.htmlStrings.rangeInput("platform-object-acceleration", "acceleration", (object ? object.acceleration : "")) +
        '<br style="clear:both;"/>';
    return result;
};

