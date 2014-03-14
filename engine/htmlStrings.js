GameCreator.htmlStrings = {
    singleSelector: function(elementId, collection, attrName, selectedKey) {
        var result = '<div><select class="selectorField" id="' + elementId + '" data-type="text"';
        if(attrName) {
        	result += ' data-attrName="' + attrName + '">'
        } else {
        	result += '>'
        }
        for (key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helperFunctions.toString(collection[key]) + "'" + (selectedKey === key ? " selected" : "") + ">" + key + "</option>";
            }
        };
        result += "</select></div>";
        return result;
    },
    numberInput: function(inputId, attrName, value) {
        return '<input id="'+ inputId +'" type="text" class="numberField" data-type="number" data-attrName="' + attrName + '" value="' + value + '"/>'
    },
    stringInput: function(inputId, attrName, value) {
        return '<input id="'+ inputId +'" type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + value + '"/>'
    },
    rangeInput: function(inputId, attrName, value) {
        var valueString;
        if (Array.isArray(value)) {
            if (value.length === 1) {
                valueString = value[0];
            }
            else {
                valueString = value[0] + ":" + value[1];
            }
        } else {
            valueString = value;
        }
        return '<input id="'+ inputId +'" type="text" class="rangeField" data-type="range" data-attrName="' + attrName + '" value="' + valueString + '"/>'
    },
    checkboxInput: function(inputId, attrName, checked) {
        return '<input id="'+ inputId +'" type="checkbox" class="checkboxField" data-type="checkbox" data-attrName="' +
            attrName + '" ' + (checked ? 'checked' : '') + ' />'
    },
    inputLabel: function(inputId, labelText) {
        return '<label for=' + inputId + ' class="textFieldLabel">' + labelText + '</label>';
    },
    parameterGroup: function(parameterInput) {
        return '<div class="actionParameter">' + parameterInput + '</div>'
    },
    timingGroup: function(timings) {
        var applicableTimings = {"Now":"now"};
        if (timings.after) {
            applicableTimings["After"] = "after";
        }
        if (timings.every) {
            applicableTimings["Every"] = "every";
        }
        if (timings.at) {
            applicableTimings["At"] = "at";
        }

        var result = GameCreator.htmlStrings.singleSelector("timing-selector", applicableTimings);
        result += '<div id="timing-parameter" class="justText" style="display:none">' + GameCreator.htmlStrings.rangeInput("timing-time", "time","3000") + 'ms</div>';
        return result;
    },
    actionRow: function(name, action) {
        var result = '<div class="actionRow headingNormalBlack"><div class="headingNormalBlack removeActionBox"><a class="removeActionButton" href="">X</a></div>\
        <span class="actionText">' + name;
        for (key in action.parameters) {
            if (action.parameters.hasOwnProperty(key)) {
                result += '<br/><span style="font-size: 12px">' + key + ': ' + action.parameters[key] + ' ';
            }
        }
        result += '</span></span></div><br style="clear:both;"/>';
        return result;
    },
    collisionMenuElement: function(object) {
        return '<div class="collisionMenuElement headingNormalBlack" data-name="' + object.name + '" ><span>' + object.name + '</span>' + '<br/>' +
        object.image.outerHTML + '</div>';
    },
    keyMenuElement: function(keyName) {
        return '<div class="keyMenuElement headingNormalBlack" data-name="' + keyName + '"><span>' + keyName + '</span></div>';
    },
    counterMenuElement: function(keyName) {
        return '<div class="counterMenuElement headingNormalBlack" data-name="' + counterName + '"><span>' + counterName + '</span></div>';
    },
    counterEventMenuElement: function(value, type) {
    	return '<div class="counterEventMenuElement headingNormalBlack" data-value="' + value + '" data-type="' + type + '"><span>' + type + " " + value+ '</span></div>';
    },
    globalObjectElement: function(object) {
        var image = object.image;
        $(image).css("width","65");
        var imgDiv = $(document.createElement("div"));
        imgDiv.append(image);
        imgDiv.addClass("global-object-element-image");

        var div = $(document.createElement("div")).append(imgDiv);
        $(div).attr("id", "object-library-element-" + object.name);
        return div;
    },
    globalObjectEditButton: function(object) {
        var button = document.createElement("button");
        $(button).append(object.name);
        $(button).addClass("library-global-object-button");
        $(button).attr("data-imgsrc", object.image.src);
        var div = $(document.createElement("div")).append(button);
        return div;
    },
    editActiveObjectForm: function(object) {
        var result = "<div id='edit-scene-object-form'>";
        result += GameCreator.htmlStrings.inputLabel("edit-active-object-height", "Height:") + 
        GameCreator.htmlStrings.rangeInput("edit-active-object-height", "height", object.height) + '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("edit-active-object-width", "Width:") +
            GameCreator.htmlStrings.rangeInput("edit-active-object-width", "width", object.width) + '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("edit-active-object-name", "Unique ID:") +
            GameCreator.htmlStrings.stringInput("edit-active-object-name", "instanceId", object.instanceId) + '<br style="clear:both;"/>';
        if (object.parent.movementType == "free") {
            result += GameCreator.htmlStrings.inputLabel("edit-active-object-speedX", "SpeedX:") + 
            GameCreator.htmlStrings.rangeInput("edit-active-object-speedX", "speedX", object.speedX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("edit-active-object-speedY", "SpeedY:") + 
            GameCreator.htmlStrings.rangeInput("edit-active-object-speedY", "speedY", object.speedY) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("edit-active-object-accX", "AccX:") + 
            GameCreator.htmlStrings.rangeInput("edit-active-object-accX", "accX", object.accX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("edit-active-object-accY", "AccY:") + 
            GameCreator.htmlStrings.rangeInput("edit-active-object-accY", "accY", object.accY) + '<br style="clear:both;"/>';
        }
        else if(object.parent.movementType == "route") {
            result += GameCreator.htmlStrings.inputLabel("edit-active-object-speed", "Speed:") +
                GameCreator.htmlStrings.rangeInput("edit-active-object-speed", "speed", object.speed) + '<br style="clear:both;"/>';
            result += "<label for='edit-active-object-start-node'>Starting Node</label><select id='edit-active-object-start-node' data-type='number' data-attrName='targetNode'>";
            for (var i = 0; i < object.route.length; i++) {
                result += "<option value='" + i + "'" + (object.targetNode == i ? 'selected' : '') + ">" + (i + 1) + "</option>";
            }
            result += "</select><br/>";
            result += "<label for='edit-active-object-route-direction'>Direction</label><select id='edit-active-object-route-direction' data-type='bool' data-attrName='routeForward'> \
                <option value='true'" + (object.routeForward ? 'selected' : '') + ">Forward</option><option value='false'" + (!object.routeForward ? 'selected' : '') + ">Backward</option></select>";
            result += "<a href='' onclick='GameCreator.drawRoute(GameCreator.selectedObject.route);return false;'>Edit route</a>" + '<br style="clear:both;"/>';
        }
        
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },

    editMouseObjectForm: function(object) {
        var result = "<div id='edit-scene-object-form'>";
        result +=GameCreator.htmlStrings.inputLabel("edit-mouse-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-mouse-object-height", "height", object.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("edit-mouse-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-mouse-object-width", "width", object.width);
        result += '<br style="clear:both;"/>';
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editPlatformObjectForm: function(object) {
        var result = '<div id="edit-scene-object-form">';
        result += GameCreator.htmlStrings.inputLabel("edit-platform-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-platform-object-height", "height", object.height);
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("edit-platform-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-platform-object-width", "width", object.width);
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        result += '<br style="clear:both;"/>';
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editTopDownObjectForm: function(object) {
        var result = '<div id="edit-scene-object-form">';
        result +=GameCreator.htmlStrings.inputLabel("edit-top-down-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("edit-top-down-object-height", "height", object.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("edit-top-down-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("edit-top-down-object-width", "width", object.width);
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.topDownMovementInputs(object);
        
        result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editCounterObjectForm: function(obj) {
    	var result = '<div id="edit-scene-object-form">';
        result += '<div id="add-counter-object-counter-selector"></div>' + 
                '<br style="clear:both;"/>';
    	if(obj.parent.textCounter) {
    		result += GameCreator.htmlStrings.counterObjectTextForm(obj);
    	} else if(obj.parent.imageCounter) {
    		result += GameCreator.htmlStrings.inputLabel("counter-object-counter-image-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-text-color", "size", obj.size);
    		result += '<br style="clear:both;"/>';
    	}
    	result += '<button id="save-scene-object-button" onClick="GameCreator.saveSceneObject(\'edit-scene-object-form\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="delete-scene-object-button" onClick="GameCreator.UI.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    routeNode: function(node, index) {
        var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.mainCanvasOffsetY) + "px;left:" + (node.x + GameCreator.mainCanvasOffsetX) + "px;'><div class='routeNode' data-index='" + index + "'> \
            <span class='routeNodeLabel'>" + (index + 1) + "</span></div> \
            <div class='routeNodeActions'><a href='' onclick='GameCreator.selectedObject.insertNode(" + index + "); return false;'>+</a>";
        if(index != 0) {    
            result += "<a href='' onclick='GameCreator.selectedObject.removeNode(" + index + "); return false;'>X</a></div></div>";
        }
        return result;
    },
    editActionsWindow: function(description, actions, existingActions) { 
        var result = "";
        result += '<div id="select-action-window" style="height: 100%"> \
        <div id="select-actions-header" class="dialogueHeader">' + description + '</div> \
        <div id="select-actions-content" class="dialogueContent">\
            <div id="select-action-dropdown-container" class="group"><div class="groupHeading">Action</div>' + GameCreator.htmlStrings.singleSelector("action-selector", actions) + '</div>\
            <div id="select-action-parameters-container" class="group" style="display:none;"><div class="groupHeading">Parameters</div>\
            <div id="select-action-parameters-content"></div></div>\
            <div id="select-action-timing-container" class="group" style="display:none;"><div class="groupHeading">Timing</div>\
            <div id="select-action-timing-content"></div></div> \
            <div id="select-action-add-button"><button id="select-action-add-action" class="regularButton addActionButton">Add</button></div>'
        
    	result += '<br style="clear:both"/>'
        result += '<div id="select-action-result">';
        result += GameCreator.htmlStrings.selectedActionsList(existingActions);
        result += '</div></div></div>';
        return result;
    },
    selectedActionsList: function(existingActions) {
        var result = "";
        for (var i = 0; i < existingActions.length; i++) {
            var action = existingActions[i];
            var selectedAction = {action: action.action, parameters: {}};

            result += GameCreator.htmlStrings.actionRow(existingActions[i].name, selectedAction);
        }
        return result;
    },
    addGlobalObjectWindow: function() {
        var result = "";

        result += '<div id="dialogue-window-title">Add new object</div> \
                   <div id="dialogue-window-menu"> \
                   <a class="tab active" data-uifunction="setupAddActiveObjectForm">Active object</a> \
                   <a class="tab" data-uifunction="setupAddPlayerObjectForm">Player object</a> \
                   <a class="tab" data-uifunction="setupAddCounterObjectForm">Counter object</a> \
                   </div> \
                   <div id="add-global-object-window-content"></div>';

        return result;
    },
    editGlobalObjectWindow: function(object) {
        var result = "";

        result += '<div id="dialogue-window-title">Edit object</div> \
                   <div id="dialogue-window-menu"> \
                   <a class="tab active" data-uifunction="setupEditGlobalObjectPropertiesForm">Properties</a>';

        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += '<a class="tab" data-uifunction="setupEditGlobalObjectCollisionsForm">Collisions</a>'
        }
        if (["topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += '<a class="tab" data-uifunction="setupEditGlobalObjectKeyActionsForm">Keys</a>'
        }
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += '<a class="tab" data-uifunction="setupEditGlobalObjectOnClickActionsForm">On click</a>'
        }
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += '<a class="tab" data-uifunction="setupEditGlobalObjectCountersForm">Counters</a>'
        }

        result += '<a class="tab" data-uifunction="setupEditGlobalObjectOnDestroyActionsForm">On destroy</a> \
                   <a class="tab" data-uifunction="setupEditGlobalObjectOnCreateActionsForm">On create</a> \
                   </div> \
                   <div id="edit-global-object-window-content"></div>';

        return result;
    },
    editGlobalObjectPropertiesContent: function(object) {
    	var result = '';
        switch(object.objectType) {
            case 'activeObject':
                result += GameCreator.htmlStrings.globalActiveObjectForm(object);
                result += '<div style="height: 10px"></div>';
                if(object.movementType === 'free') {
                    result += GameCreator.htmlStrings.freeMovementInputs(object);
                }
                else {
                    result += GameCreator.htmlStrings.routeMovementInputs(object);
                }
                break;
            case 'mouseObject':
                result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
                result += '<div style="height: 10px"></div>';
                result += GameCreator.htmlStrings.mouseMovementInputs(object);
                break;
            case 'topDownObject':
                result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
                result += '<div style="height: 10px"></div>';
                result += GameCreator.htmlStrings.topDownMovementInputs(object);
                break;
            case 'platformObject':
                result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
                result += '<div style="height: 10px"></div>';
                result += GameCreator.htmlStrings.platformMovementInputs(object);
                break;
            case 'counterObject':
                result += GameCreator.htmlStrings.globalCounterObjectForm(object);
                break;
            default:
                break;
        }
        if(object.objectType !== 'counterObject') {
            result += GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique:');
            result += GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique', object.unique);
            result += '<br style="clear:both"/>';
        }
        result += '<button class="regularButton" id="save-global-object-properties-button">Save</button>';
        return result;
    },
    editGlobalObjectCollisionsContent: function(collisionObjects) {
        var result = '<div id="edit-collision-actions-object-menu-container"><div id="edit-collision-actions-object-menu">';
        result += '<button id="add-new-collision-button" class="regularButton">Add</button>';

        for(var i = 0; i < collisionObjects.length; i++) {
            result += GameCreator.htmlStrings.collisionMenuElement(collisionObjects[i]);
        }
        
        result += '</div> \
                   </div><div id="edit-collision-actions-object-content"></div>';
        return result;
    },
    editGlobalObjectKeyActionsContent: function(object) {
        var result = '<div id="edit-key-actions-object-menu-container"><div id="edit-key-actions-key-menu">';
        result += '<div id="add-new-key-button" class="regularButton">Add</div>';
        for (keyName in object.keyActions) {
            if(object.keyActions.hasOwnProperty(keyName)) {
                result += GameCreator.htmlStrings.keyMenuElement(keyName);
            }
        }
        result += '</div></div><div id="edit-key-actions-key-content"></div>';
        return result;
    },
    editGlobalObjectCountersContent: function(object) {
        var result = '<div id="edit-counters-menu">';
        result += '<button id="add-new-counter-button" class="regularButton">Add</button>';
        for (counterName in object.counters) {
            if(object.counters.hasOwnProperty(counterName)) {
                result += GameCreator.htmlStrings.counterMenuElement(counterName);
            }
        }
        result += '</div><div id="edit-counters-counter-content">'
        result += '<div id="edit-counter-event-content"></div>';
        result += '<div id="edit-counter-event-actions-content"></div></div>';
        return result;
    },
    freeMovementInputs: function(object) {
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
    },
    routeMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("route-object-speed", "Speed:") +
            GameCreator.htmlStrings.numberInput("route-object-speed", "speed", (object ? object.speed : "") ) +
            '<br style="clear:both;"/>';
    },
    globalActiveObjectForm: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("active-object-width", "Width:") +
                GameCreator.htmlStrings.rangeInput("active-object-width", "width", object.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("active-object-height", "Height:") +
                GameCreator.htmlStrings.rangeInput("active-object-height", "height", object.height) +
                '<br style="clear:both;"/>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        var result = '<div>' +
                GameCreator.htmlStrings.inputLabel("player-object-width", "Width:") +
                GameCreator.htmlStrings.rangeInput("player-object-width", "width", object.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-height", "Height:") +
                GameCreator.htmlStrings.rangeInput("player-object-height", "height", object.height) + '</div>' +
                '<br style="clear:both;"/>';
        return result;
    },
    
    globalCounterObjectForm: function(obj) {
    	if(obj.textCounter) {
    		return GameCreator.htmlStrings.counterObjectTextForm(obj);
    	} else if (obj.imageCounter) {
    		return GameCreator.htmlStrings.inputLabel("counter-object-counter-image-size", "Size:") + GameCreator.htmlStrings.stringInput("counter-object-counter-text-color", "size", obj.size ? obj.size : '') +
				'<br style="clear:both;"/>';
    	}
    },
    
    mouseMovementInputs: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("mouse-object-minX", "Min X:") + GameCreator.htmlStrings.numberInput("mouse-object-minX", "minX", (object ? object.minX : ""));
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("mouse-object-minX", "Min Y:") + GameCreator.htmlStrings.numberInput("mouse-object-minY", "minY", (object ? object.minY : ""));
        result += '<br style="clear:both;"/>';
        
        result += GameCreator.htmlStrings.inputLabel("mouse-object-maxX", "Max X:") + GameCreator.htmlStrings.numberInput("mouse-object-maxX", "maxX", (object ? object.maxX : ""));
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("mouse-object-maxX", "Max Y:") + GameCreator.htmlStrings.numberInput("mouse-object-maxY", "maxY", (object ? object.maxY : ""));
        result += '<br style="clear:both;"/>';
        return result;
    },
    platformMovementInputs: function(object) {
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
    },
    topDownMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("topDown-object-max-speed", "Speed:") +
            GameCreator.htmlStrings.rangeInput("topDown-object-max-speed", "maxSpeed", (object ? object.maxSpeed : "")) +
            '<br style="clear:both;"/>';
    },
    
    /*



        Start
    */

    addActiveObjectForm: function() {
        var result = GameCreator.htmlStrings.inputLabel("active-object-name", "Name:") + 
            GameCreator.htmlStrings.stringInput("active-object-name", "name", "") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("active-object-width", "Width:") +
            GameCreator.htmlStrings.rangeInput("active-object-width", "width", "") +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("active-object-height", "Height:") +
            GameCreator.htmlStrings.rangeInput("active-object-height", "height", "") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("active-object-src", "Image Src:") + 
            GameCreator.htmlStrings.stringInput("active-object-src", "src", "") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("active-object-movement-type", "Movement:") +
            GameCreator.htmlStrings.singleSelector("active-object-movement-type", {"Free": "free", "Route": "route"}, "movementType") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("active-object-unique", "Unique:") +
            GameCreator.htmlStrings.checkboxInput("active-object-unique", "unique", false) +
            '<br style="clear:both;"/><button class="saveButton regularButton">Save</button>';
        return result;
    },

    /*



        End
    */
    
    addPlayerObjectForm: function() {
        return 	GameCreator.htmlStrings.inputLabel("player-object-name", "Name:") + GameCreator.htmlStrings.stringInput("player-object-name", "name", "") +
        		'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("player-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("player-object-width", "width", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("player-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("player-object-height", "height", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("player-object-src", "Image Src:") + GameCreator.htmlStrings.stringInput("player-object-src", "src", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("player-object-type", "Control:") + GameCreator.htmlStrings.singleSelector("player-object-type", {"Mouse": "addPlayerMouseObject", "Platform": "addPlayerPlatformObject", "Top Down": "addPlayerTopDownObject"}) + '<br style="clear:both;"/>' +
				'<div id="add-player-object-movement-parameters"></div><button class="saveButton regularButton">Save</button>'
	},
	
	//Add counter object strings
	addCounterObjectForm: function() {
		return 	GameCreator.htmlStrings.inputLabel("counter-object-name", "Name:") + GameCreator.htmlStrings.stringInput("counter-object-name", "name", "") +
        		'<br style="clear:both;"/>' +
            	GameCreator.htmlStrings.inputLabel("counter-representation", "Show as:") + 
            	GameCreator.htmlStrings.singleSelector("counter-representation", {"Text": "text", "Repeating Image": "image"}, "representation") +
            	'<br style="clear:both;"/>' +
            	'<div id="add-counter-object-counter-representation-content"></div>' +
            	'<button class="saveButton regularButton">Save</button>';
	},
	
	counterObjectTextForm: function(obj) {
		return GameCreator.htmlStrings.inputLabel("counter-object-counter-text-font", "Font:") + GameCreator.htmlStrings.stringInput("counter-object-counter-text-font", "font", obj && obj.font ? obj.font : '') +
				'<br style="clear:both;"/>' +
				GameCreator.htmlStrings.inputLabel("counter-object-counter-text-color", "Color:") + GameCreator.htmlStrings.stringInput("counter-object-counter-text-color", "color", obj && obj.color ? obj.color : '') +
				'<br style="clear:both;"/>' +
				GameCreator.htmlStrings.inputLabel("counter-object-counter-text-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-text-size", "size", obj && obj.size ? obj.size : '') +
				'<br style="clear:both;"/>';
	},
	
	addCounterObjectImage: function() {
		return GameCreator.htmlStrings.inputLabel("counter-object-counter-image-src", "Src:") + GameCreator.htmlStrings.stringInput("counter-object-counter-image-src", "src", "") +
				'<br style="clear:both;"/>' +
				GameCreator.htmlStrings.inputLabel("counter-object-counter-image-size", "Size:") + GameCreator.htmlStrings.numberInput("counter-object-counter-text-color", "size", "") +
				'<br style="clear:both;"/>';
	},
	
    collisionObjectSelector: function(object) {
    	var result = '';
    	var selectableObjects = {};
    	$.extend(selectableObjects, GameCreator.globalObjects, GameCreator.borderObjects);
    	for (objName in selectableObjects) {
            if (selectableObjects.hasOwnProperty(objName) && !object.collisionActions.hasOwnProperty(objName) && selectableObjects[objName].isCollidable && objName != object.name) {
        		result += '<div class="addCollisionObjectElement" data-objectname="' + objName + '" style="float:left;cursor:pointer">' + selectableObjects[objName].image.outerHTML + '</br><span>' + objName + '</span></div>';
        	}
    	}
    	return result;
	},
    keySelector: function(object) {
        result = "";
        var selectableKeys = object.keyPressed;
        for (keyName in selectableKeys) {
            if(selectableKeys.hasOwnProperty(keyName) && !object.keyActions.hasOwnProperty(keyName)) {
                result += '<div class="addKeyObjectElement" data-keyName="' + keyName + '" style="float:left;cursor:pointer;"><span>' + keyName + '</span></div>';
            }
        }
        return result;
    },
    createCounterForm: function() {
    	var result = '<div>'
    	result += GameCreator.htmlStrings.inputLabel("counter-name", "Name:");
    	result += GameCreator.htmlStrings.stringInput("counter-name", "name", "");
    	result += '<button class="saveButton regularButton">Save</button>';
    	return result;
	},
	editCounterEventsContent: function(counter){
		var result = '<button id="add-new-counter-event-button" class="regularButton">Add</button>';
		result += GameCreator.htmlStrings.counterEventMenuElement("", "onIncrease");
		result += GameCreator.htmlStrings.counterEventMenuElement("", "onDecrease");
		for (value in counter.atValue) {
            if (counter.atValue.hasOwnProperty(value)){
            	result += GameCreator.htmlStrings.counterEventMenuElement(value, "atValue");
        	}
    	};
    	for (value in counter.aboveValue) {
            if (counter.aboveValue.hasOwnProperty(value)){
            	result += GameCreator.htmlStrings.counterEventMenuElement(value, "aboveValue");
        	}
    	};
    	for (value in counter.belowValue) {
            if (counter.belowValue.hasOwnProperty(value)){
            	result += GameCreator.htmlStrings.counterEventMenuElement(value, "belowValue");
        	}
    	};
    	return result;
	},
	createCounterEventForm: function(){
		var result = GameCreator.htmlStrings.inputLabel("edit-counter-event-type", "Type:");
		result += GameCreator.htmlStrings.singleSelector("edit-counter-event-type", {atValue: "atValue", aboveValue: "aboveValue", belowValue: "belowValue"});
		result += GameCreator.htmlStrings.inputLabel("edit-counter-event-value", "Value:");
    	result += GameCreator.htmlStrings.numberInput("edit-counter-event-value", "value", "");
    	result += '<button class="saveButton regularButton">Save</button>';
    	return result;
	},
    debugInformation: function(info){
        var result = '';
        for(var key in info){
            if(info.hasOwnProperty(key)){
                result += '<span>' + key + ': ' + info[key] + '</span><br/>';
            }
        }
        return result;
    },
	sceneTab: function(sceneNr, sceneActive){
		return '<div class="tab ' + (sceneActive ? 'active' : '') + '" data-sceneNr="' + sceneNr + '">' + sceneNr + '</div>';
	},
	addSceneTab: function(){
		return '<div id="add-scene-tab" class="tab">+</div>';
	}
};