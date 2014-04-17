GameCreator.htmlStrings = {
    singleSelector: function(elementId, collection, attrName, selectedKey) {
        var result = '<div><select class="selectorField" id="' + elementId + '" data-type="text"';
        if (attrName) {
        	result += ' data-attrName="' + attrName + '">'
        } else {
        	result += '>'
        }
        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helperFunctions.toString(collection[key]) + "'" + (selectedKey === key ? " selected" : "") + ">" + key + "</option>";
            }
        };
        result += "</select></div>";
        return result;
    },
    numberInput: function(inputId, attrName, value) {
        return '<input id="'+ inputId +'" type="text" class="numberField" data-type="number" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },
    stringInput: function(inputId, attrName, value) {
        return '<input id="'+ inputId +'" type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
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
        return '<input id="'+ inputId +'" type="text" class="rangeField" data-type="range" data-attrName="' + attrName + '" value="' + (valueString === undefined ? '' : valueString) + '"/>'
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
        for (var key in action.parameters) {
            if (action.parameters.hasOwnProperty(key)) {
                result += '<br/><span style="font-size: 12px">' + key + ': ' + action.parameters[key] + ' ';
            }
        }
        result += '</span></span></div><br style="clear:both;"/>';
        return result;
    },
    collisionMenuElement: function(object) {
        return '<div class="collisionMenuElement headingNormalBlack" data-name="' + object.objectName + '" ><span>' + object.objectName + '</span>' + '<br/>' +
        object.image.outerHTML + '</div>';
    },
    keyMenuElement: function(keyName) {
        return '<div class="keyMenuElement headingNormalBlack" data-name="' + keyName + '"><span>' + keyName + '</span></div>';
    },
    counterMenuElement: function(counterName) {
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
        $(div).attr("id", "object-library-element-" + object.objectName);
        return div;
    },
    globalObjectEditButton: function(object) {
        var button = document.createElement("button");
        $(button).append(object.objectName);
        $(button).addClass("library-global-object-button");
        $(button).attr("data-imgsrc", object.image.src);
        var div = $(document.createElement("div")).append(button);
        return div;
    },

    routeNode: function(node, index) {
        var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.mainCanvasOffsetY) + "px;left:" + (node.x + GameCreator.mainCanvasOffsetX) + "px;'><div class='routeNode' data-index='" + index + "'> \
            <span class='routeNodeLabel'>" + (index + 1) + "</span></div> \
            <div class='routeNodeActions'><a href='' onclick='GameCreator.selectedObject.insertNode(" + index + "); return false;'>+</a>";
        if (index != 0) {    
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
    
    imageSrcInput: function(object) {
        return GameCreator.htmlStrings.inputLabel("global-object-image-src", "Image:") + 
            GameCreator.htmlStrings.stringInput("global-object-image-src", "image.src", (object && object.image ? object.image.src : ""))
    },

    
    addGlobalObjectWindow: function() {
        var result = "";

        result += '<div id="dialogue-window-title">Add new object</div> \
                   <div id="dialogue-window-menu"> \
                   <a class="tab dialogue-window-tab active" data-uifunction="setupAddActiveObjectForm">Active object</a> \
                   <a class="tab dialogue-window-tab" data-uifunction="setupAddPlayerObjectForm">Player object</a> \
                   <a class="tab dialogue-window-tab" data-uifunction="setupAddCounterObjectForm">Counter object</a> \
                   </div> \
                   <div id="add-global-object-window-content"></div>';

        return result;
    },
    addPlayerObjectForm: function() {
        return  GameCreator.htmlStrings.inputLabel("player-object-name", "Name:") + GameCreator.htmlStrings.stringInput("player-object-name", "objectName", "") +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-width", "Width:") + GameCreator.htmlStrings.rangeInput("player-object-width", "width", "") +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-height", "Height:") + GameCreator.htmlStrings.rangeInput("player-object-height", "height", "") +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-src", "Image Src:") + GameCreator.htmlStrings.stringInput("player-object-src", "image.src", "") +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique:') +
                GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique') +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-type", "Control:") + GameCreator.htmlStrings.singleSelector("player-object-type", {"Mouse": "addPlayerMouseObject", "Platform": "addPlayerPlatformObject", "Top Down": "addPlayerTopDownObject"}) + '<br style="clear:both;"/>' +
                '<div id="add-player-object-movement-parameters"></div><button class="saveButton regularButton">Save</button>'
    },
    

    collisionObjectSelector: function(object) {
        var result = '';
        var selectableObjects = {};
        var objName;
        $.extend(selectableObjects, GameCreator.globalObjects, GameCreator.borderObjects);
        for (objName in selectableObjects) {
            if (selectableObjects.hasOwnProperty(objName) && !object.collisionActions.hasOwnProperty(objName) && selectableObjects[objName].isCollidable && objName != object.objectName) {
                result += '<div class="addCollisionObjectElement" data-objectname="' + objName + '" style="float:left;cursor:pointer">' + selectableObjects[objName].image.outerHTML + '</br><span>' + objName + '</span></div>';
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
            if (info.hasOwnProperty(key)){
                result += '<span>' + key + ': ' + info[key] + '</span><br/>';
            }
        }
        return result;
    },
	sceneTab: function(sceneNr, sceneActive){
		return '<div class="tab scene-tab ' + (sceneActive ? 'active' : '') + '" data-sceneNr="' + sceneNr + '">' + sceneNr + '</div>';
	},
	addSceneTab: function(){
		return '<div id="add-scene-tab" class="tab scene-tab">+</div>';
	}
};