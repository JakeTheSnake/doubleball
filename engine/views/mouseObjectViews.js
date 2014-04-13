
GameCreator.MouseObject.sceneObjectForm = function(sceneObject) {
    var result = "<div id='edit-scene-object-form'>";
    result += GameCreator.htmlStrings.inputLabel("edit-mouse-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-mouse-object-height", "height", sceneObject.height);
    result += '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("edit-mouse-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-mouse-object-width", "width", sceneObject.width);
    result += '<br style="clear:both;"/>';
    
    result += GameCreator.MouseObject.movementInputs(sceneObject);
    
    result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
    return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.MouseObject.prototype.editGlobalObjectForm = function() {
    var result = '';
    result += GameCreator.htmlStrings.globalPlayerObjectForm(this);
    result += '<div style="height: 10px"></div>';
    result += GameCreator.MouseObject.movementInputs(this);
    result += GameCreator.htmlStrings.imageSrcInput(this);
    result += '<br style="clear:both"/>';
    result += GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique:');
    result += GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique', this.unique);
    result += '<br style="clear:both"/>';
    result += '<button class="regularButton" id="save-global-object-properties-button">Save</button>';
    return result;
};

GameCreator.MouseObject.prototype.getTabs = function(){
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectKeyActionsForm">Keys</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupEditGlobalObjectCountersForm">Counters</a>';
}

GameCreator.MouseObject.movementInputs = function(object) {
    var result = GameCreator.htmlStrings.inputLabel("mouse-object-minX", "Min X:") + GameCreator.htmlStrings.numberInput("mouse-object-minX", "minX", (object ? object.minX : ""));
    result += '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("mouse-object-minX", "Min Y:") + GameCreator.htmlStrings.numberInput("mouse-object-minY", "minY", (object ? object.minY : ""));
    result += '<br style="clear:both;"/>';
    
    result += GameCreator.htmlStrings.inputLabel("mouse-object-maxX", "Max X:") + GameCreator.htmlStrings.numberInput("mouse-object-maxX", "maxX", (object ? object.maxX : ""));
    result += '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("mouse-object-maxX", "Max Y:") + GameCreator.htmlStrings.numberInput("mouse-object-maxY", "maxY", (object ? object.maxY : ""));
    result += '<br style="clear:both;"/>';
    return result;
};

