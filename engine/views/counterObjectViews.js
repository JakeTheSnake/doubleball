GameCreator.CounterObject.addGlobalObjectForm = function() {
    return  GameCreator.htmlStrings.inputLabel("counter-object-name", "Name:") + GameCreator.htmlStrings.stringInput("counter-object-name", "objectName", "") +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("counter-representation", "Show as:") + 
            GameCreator.htmlStrings.singleSelector("counter-representation", {"Text": "text", "Repeating Image": "image"}, "representation") +
            '<br style="clear:both;"/>' +
            '<div id="add-counter-object-counter-representation-content"></div>' +
            '<button class="saveButton regularButton">Save</button>';
};

GameCreator.CounterObject.sceneObjectForm = function(sceneObject, counterCarriers) {
    var result = '<div id="edit-scene-object-form">';
    result += '<div id="add-counter-object-counter-selector">' + 
        GameCreator.htmlStrings.inputLabel('add-counter-counter-object', 'Object') +
        GameCreator.htmlStrings.singleSelector('add-counter-counter-object', counterCarriers, 'counterObject', sceneObject.counterObject) +
        '<div id="counter-list-content"></div>' +
        '</div>' + 
        '<br style="clear:both;"/>';
    if(sceneObject.parent.textCounter) {
        result += GameCreator.CounterObject.counterObjectTextForm(sceneObject);
    } else if(sceneObject.parent.imageCounter) {
        result += GameCreator.htmlStrings.inputLabel("counter-object-counter-image-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-image-size", "size", sceneObject && sceneObject.size ? sceneObject.size : '') +
            '<br style="clear:both;"/>';
    }
    result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
    return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.CounterObject.prototype.getPropertiesForm = function() {
    var result = '';
    if(this.textCounter) {
        result += GameCreator.CounterObject.counterObjectTextForm(this);
    } else if (this.imageCounter) {
        result += GameCreator.CounterObject.counterObjectImageForm(this);
    }
    result += '<br style="clear:both;"/>';
    result += '<button class="regularButton" id="save-global-object-properties-button">Save</button>';
    return result;
};

GameCreator.CounterObject.prototype.getTabs = function() {
        return  '';
};

GameCreator.CounterObject.counterObjectTextForm = function(object) {
    return GameCreator.htmlStrings.inputLabel("counter-object-counter-text-font", "Font:") + GameCreator.htmlStrings.stringInput("counter-object-counter-text-font", "font", object && object.font ? object.font : '') +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("counter-object-counter-text-color", "Color:") + GameCreator.htmlStrings.stringInput("counter-object-counter-text-color", "color", object && object.color ? object.color : '') +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("counter-object-counter-text-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-text-size", "size", object && object.size ? object.size : '') +
            '<br style="clear:both;"/>';
};

GameCreator.CounterObject.counterObjectImageForm = function(object) {
    return GameCreator.htmlStrings.inputLabel("counter-object-counter-image-src", "Src:") + GameCreator.htmlStrings.stringInput("counter-object-counter-image-src", "image.src", object && object.image.src ? object.image.src : '') +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("counter-object-counter-image-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-image-size", "size", object && object.size ? object.size : '') +
            '<br style="clear:both;"/>';
};
