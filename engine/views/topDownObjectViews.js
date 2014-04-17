GameCreator.TopDownObject.sceneObjectForm = function(sceneObject) {
    var result = '<div id="edit-scene-object-form">';
        result +=GameCreator.htmlStrings.inputLabel("edit-top-down-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-top-down-object-height", "height", sceneObject.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("edit-top-down-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-top-down-object-width", "width", sceneObject.width);
        result += '<br style="clear:both;"/>';
        result += GameCreator.TopDownObject.movementInputs(sceneObject);
        
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.TopDownObject.prototype.getTabs = function() {
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectKeyActionsForm">Keys</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectCountersForm">Counters</a>';
}

GameCreator.TopDownObject.movementInputs = function(object) {
    return  GameCreator.htmlStrings.inputLabel("topDown-object-max-speed", "Speed:") +
            GameCreator.htmlStrings.rangeInput("topDown-object-max-speed", "maxSpeed", (object ? object.maxSpeed : "")) +
            '<br style="clear:both;"/>';
};

