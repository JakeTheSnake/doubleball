GameCreator.ActiveObject.addGlobalObjectForm = function() {
    var result = GameCreator.htmlStrings.inputLabel("active-object-name", "Name:") + 
        GameCreator.htmlStrings.stringInput("active-object-name", "objectName", "") + '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-width", "Width:") +
        GameCreator.htmlStrings.rangeInput("active-object-width", "width", "") +
        '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-height", "Height:") +
        GameCreator.htmlStrings.rangeInput("active-object-height", "height", "") + '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-src", "Image Src:") + 
        GameCreator.htmlStrings.stringInput("active-object-src", "image.src", "") + '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-unique", "Unique:") +
        GameCreator.htmlStrings.checkboxInput("active-object-unique", "unique", false) +
        '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-movement-type", "Movement:") +
        GameCreator.htmlStrings.singleSelector("active-object-movement-type", {"Free": "free", "Route": "route"}, "movementType") + '<br style="clear:both;"/>' +
        '<div id="add-active-object-movement-parameters"></div>' +
        '<br style="clear:both;"/><button class="saveButton regularButton">Save</button>';
    return result;
};

GameCreator.ActiveObject.sceneObjectForm = function(sceneObject) {
    var result = "<div id='edit-scene-object-form'>";
    result += GameCreator.htmlStrings.inputLabel("edit-active-object-height", "Height:") + 
    GameCreator.htmlStrings.rangeInput("edit-active-object-height", "height", sceneObject.height) + '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("edit-active-object-width", "Width:") +
        GameCreator.htmlStrings.rangeInput("edit-active-object-width", "width", sceneObject.width) + '<br style="clear:both;"/>';
    result += GameCreator.htmlStrings.inputLabel("edit-active-object-name", "Unique ID:") +
        GameCreator.htmlStrings.stringInput("edit-active-object-name", "instanceId", sceneObject.instanceId) + '<br style="clear:both;"/>';
    if (sceneObject.parent.movementType == "free") {
        result += GameCreator.ActiveObject.freeMovementInputs(sceneObject);
    }
    else if (sceneObject.parent.movementType == "route") {
        result += GameCreator.ActiveObject.routeMovementInputs(sceneObject);
        result += "<label for='edit-active-object-start-node'>Starting Node</label><select id='edit-active-object-start-node' data-type='number' data-attrName='targetNode'>";
        for (var i = 0; i < sceneObject.route.length; i++) {
            result += "<option value='" + i + "'" + (sceneObject.targetNode == i ? 'selected' : '') + ">" + (i + 1) + "</option>";
        }
        result += "</select><br/>";
        result += "<label for='edit-active-object-route-direction'>Direction</label><select id='edit-active-object-route-direction' data-type='bool' data-attrName='routeForward'> \
            <option value='true'" + (sceneObject.routeForward ? 'selected' : '') + ">Forward</option><option value='false'" + (!sceneObject.routeForward ? 'selected' : '') + ">Backward</option></select>";
        result += "<a href='' onclick='GameCreator.drawRoute(GameCreator.selectedObject.route);return false;'>Edit route</a>" + '<br style="clear:both;"/>';
    }
    
    result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
    return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
};

GameCreator.ActiveObject.prototype.getPropertiesForm = function(stateId) {
    var state = this.getState(stateId);
    var result = '<div id="global-object-properties-content">';
    result += GameCreator.htmlStrings.inputLabel("active-object-width", "Width:") +
        GameCreator.htmlStrings.rangeInput("active-object-width", "width", state.width) +
        '<br style="clear:both;"/>' +
        GameCreator.htmlStrings.inputLabel("active-object-height", "Height:") +
        GameCreator.htmlStrings.rangeInput("active-object-height", "height", state.height) +
        '<br style="clear:both;"/>' +
        '<div style="height: 10px"></div>';
    if (this.movementType === 'free') {
        result += GameCreator.ActiveObject.freeMovementInputs(state);
    }
    else {
        result += GameCreator.ActiveObject.routeMovementInputs(state);
    }
    result += GameCreator.htmlStrings.imageSrcInput(state);
    result += '<br style="clear:both"/>';
    result += '<button class="regularButton" id="save-global-object-properties-button">Save</button>';
    result += '</div>'
    return result;
};

GameCreator.ActiveObject.prototype.getTabs = function() {
        return  '<a class="tab dialogue-window-tab" data-uifunction="setupCollisionsForm">Collisions</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupOnClickActionsForm">On click</a>' +
                '<a class="tab dialogue-window-tab" data-uifunction="setupCountersForm">Counters</a>';
};

GameCreator.ActiveObject.prototype.getStateForm = function(stateId) {
    return 'CONTENT FOR STATE ' + stateId;
};

GameCreator.ActiveObject.freeMovementInputs = function(object) {
    return GameCreator.htmlStrings.inputLabel("free-object-speedX", "SpeedX:") +
            GameCreator.htmlStrings.rangeInput("free-object-speedX", "speedX",(object ? object.speedX : "") ) +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("free-object-speedY", "SpeedY:") +
            GameCreator.htmlStrings.rangeInput("free-object-speedY", "speedY", (object ? object.speedY : "") ) +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("free-object-accX", "AccX:") +
            GameCreator.htmlStrings.rangeInput("free-object-accX", "accX", (object ? object.accX : "") ) +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("free-object-accY", "AccY:") +
            GameCreator.htmlStrings.rangeInput("free-object-accY", "accY", (object ? object.accY : "") ) +
            '<br style="clear:both;"/>';
};

GameCreator.ActiveObject.routeMovementInputs = function(object) {
    return GameCreator.htmlStrings.inputLabel("route-object-speed", "Speed:") +
        GameCreator.htmlStrings.rangeInput("route-object-speed", "speed", (object ? object.speed : "") ) +
        '<br style="clear:both;"/>';
};

