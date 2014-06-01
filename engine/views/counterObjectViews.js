GameCreator.CounterObjectText.sceneObjectForm = function(sceneObject, counterCarriers) {
    var result = '<div id="edit-scene-object-form">';
    result += '<div id="add-counter-object-counter-selector">' + 
        GameCreator.htmlStrings.inputLabel('add-counter-counter-object', 'Object') +
        GameCreator.htmlStrings.singleSelector('add-counter-counter-object', counterCarriers, 'counterObject', sceneObject.counterObject) +
        '<div id="counter-list-content"></div>' +
        '</div>' + 
        '<br style="clear:both;"/>';
    result += GameCreator.helpers.getAttributeForm(GameCreator[sceneObject.parent.objectType].objectAttributes,
        GameCreator[sceneObject.parent.objectType].objectAttributes,
        sceneObject);
    result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
    return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.CounterObjectText.prototype.getNonStatePropertiesForm = function() {
        return  '';
};

GameCreator.CounterObjectText.prototype.getTabs = function() {
        return  '';
};

GameCreator.CounterObjectText.prototype.getStateForm = function(stateId) {
    return 'CONTENT FOR STATE ' + stateId;
};

GameCreator.CounterObjectText.prototype.getEditWindow = function() {
    var result = "";

    result += '<div id="dialogue-window-title">Edit object</div> \
               <div id="dialogue-window-menu"> \
               <a class="tab dialogue-window-tab active" data-uifunction="setupPropertiesForm">Properties</a>';

    result += this.getTabs();
    result +=  '<a class="tab dialogue-window-tab" data-uifunction="setupStatesForm">States</a>';
    result +=  '</div><div id="edit-global-object-window-content"></div>';

    return result;
};

/*GameCreator.CounterObject.counterObjectTextForm = function(object) {
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
};*/
