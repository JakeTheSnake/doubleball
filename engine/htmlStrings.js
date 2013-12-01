GameCreator.htmlStrings = {
    singleSelector: function(elementId, collection, attrName) {
        var result = '<div><select class="selectorField" id="' + elementId + '" data-type="text"';
        if(attrName) {
        	result += ' data-attrName="' + attrName + '">'
        } else {
        	result += '>'
        }
        for (key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helperFunctions.toString(collection[key]) + "'>" + key + "</option>";
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
                valueString = value[0] + "-" + value[1];
            }
        } else {
            valueString = value;
        }
        return '<input id="'+ inputId +'" type="text" class="rangeField" data-type="range" data-attrName="' + attrName + '" value="' + valueString + '"/>'
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

        var result = GameCreator.htmlStrings.singleSelector("timing", applicableTimings);
        result += '<div id="timingParameter" class="justText" style="display:none">' + GameCreator.htmlStrings.rangeInput("timingTime", "time","3000") + 'ms</div>';
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
        imgDiv.addClass("globalObjectElementImage");
        var div = $(document.createElement("div")).append(imgDiv);
        $(div).attr("id", "globalObjectElement_" + object.name);
        return div;
    },
    globalObjectEditButton: function(object) {
        var button = document.createElement("button");
        $(button).append(object.name);
        $(button).addClass("regularButton");
        var div = $(document.createElement("div")).append(button);
        return div;
    },
    editActiveObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += GameCreator.htmlStrings.inputLabel("editActiveObjectHeight", "Height:") + 
        GameCreator.htmlStrings.rangeInput("editActiveObjectHeight", "height", object.height) + '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("editActiveObjectWidth", "Width:") +
            GameCreator.htmlStrings.rangeInput("editActiveObjectWidth", "width", object.width) + '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("editActiveObjectName", "Unique ID:") +
            GameCreator.htmlStrings.stringInput("editActiveObjectName", "instanceId", object.instanceId) + '<br style="clear:both;"/>';
        if (object.parent.movementType == "free") {
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeedX", "SpeedX:") + 
            GameCreator.htmlStrings.rangeInput("editActiveObjectSpeedX", "speedX", object.speedX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeedY", "SpeedY:") + 
            GameCreator.htmlStrings.rangeInput("editActiveObjectSpeedY", "speedY", object.speedY) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectAccX", "AccX:") + 
            GameCreator.htmlStrings.rangeInput("editActiveObjectAccX", "accX", object.accX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectAccY", "AccY:") + 
            GameCreator.htmlStrings.rangeInput("editActiveObjectAccY", "accY", object.accY) + '<br style="clear:both;"/>';
        }
        else if(object.parent.movementType == "route") {
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeed", "Speed:") +
                GameCreator.htmlStrings.rangeInput("editActiveObjectSpeed", "speed", object.speed) + '<br style="clear:both;"/>';
            result += "<label for='editActiveObjectStartNode'>Starting Node</label><select id='editActiveObjectStartNode' data-type='number' data-attrName='targetNode'>";
            for (var i = 0; i < object.route.length; i++) {
                result += "<option value='" + i + "'" + (object.targetNode == i ? 'selected' : '') + ">" + (i + 1) + "</option>";
            }
            result += "</select><br/>";
            result += "<label for='editActiveObjectRouteDirection'>Direction</label><select id='editActiveObjectRouteDirection' data-type='bool' data-attrName='routeForward'> \
                <option value='true'" + (object.routeForward ? 'selected' : '') + ">Forward</option><option value='false'" + (!object.routeForward ? 'selected' : '') + ">Backward</option></select>";
            result += "<a href='' onclick='GameCreator.drawRoute(GameCreator.selectedObject.route);return false;'>Edit route</a>" + '<br style="clear:both;"/>';
        }
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveSceneObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },

    editMouseObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editMouseObjectHeight", "height", object.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editMouseObjectWidth", "width", object.width);
        result += '<br style="clear:both;"/>';
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveFormInputToObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editPlatformObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editPlatformObjectHeight", "height", object.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editPlatformObjectWidth", "width", object.width);
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        result += '<br style="clear:both;"/>';
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveFormInputToObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editTopDownObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editTopDownObjectHeight", "height", object.height);
        result += '<br style="clear:both;"/>';
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editTopDownObjectWidth", "width", object.width);
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.topDownMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveFormInputToObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    routeNode: function(node, index) {
        var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.canvasOffsetY) + "px;left:" + (node.x + GameCreator.canvasOffsetX) + "px;'><div class='routeNode' data-index='" + index + "'> \
            <span class='routeNodeLabel'>" + (index + 1) + "</span></div> \
            <div class='routeNodeActions'><a href='' onclick='GameCreator.selectedObject.insertNode(" + index + "); return false;'>+</a>";
        if(index != 0) {    
            result += "<a href='' onclick='GameCreator.selectedObject.removeNode(" + index + "); return false;'>X</a></div></div>";
        }
        return result;
    },
    editActionsWindow: function(description, actions, existingActions) { 
        var result = "";
        result += '<div id="selectActionWindow" style="height: 100%"> \
        <div id="selectActionsHeader" class="dialogueHeader">' + description + '</div> \
        <div id="selectActionsContent" class="dialogueContent">\
            <div id="selectActionDropdownContainer" class="group"><div class="groupHeading">Action</div>' + GameCreator.htmlStrings.singleSelector("actionSelector", actions) + '</div>\
            <div id="selectActionParametersContainer" class="group" style="display:none;"><div class="groupHeading">Parameters</div>\
            <div id="selectActionParametersContent"></div></div>\
            <div id="selectActionTimingContainer" class="group" style="display:none;"><div class="groupHeading">Timing</div>\
            <div id="selectActionTimingContent"></div></div> \
            <div id="selectActionAddButton"><button id="selectActionAddAction" class="regularButton addActionButton">Add</button></div>'
        
    	result += '<br/ style="clear:both">'
        result += '<div id="selectActionResult">';
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
        result += "<div id='editGlobalObjectTabContainer' class='tabContainer'>\
                    <div class='tab' data-uifunction='setupAddActiveObjectForm'><span>Active Object</span></div> \
                   <div class='tab' data-uifunction='setupAddPlayerObjectForm'><span>Player Object<span></div></div> \
                   <div id='addGlobalObjectWindowContent'></div>";
        return result;
    },
    editGlobalObjectWindow: function(object) {
        var result = "";
        result += "<div id='editGlobalObjectTabContainer' class='tabContainer'>";
        result += "<div class='tab' data-uifunction='setupEditGlobalObjectPropertiesForm'><span>Properties</span></div>";
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectCollisionsForm'><span>Collisions<span></div>";
        }
        if (["topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectKeyActionsForm'><span>Keys</span></div>";
        }
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectOnClickActionsForm'><span>OnClick<span></div>";
        }
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectCountersForm'><span>Counters</span></div>";
        }
        result += "<div class='tab' data-uifunction='setupEditGlobalObjectOnDestroyActionsForm'><span>OnDestroy</span></div>"
        result += "<div class='tab' data-uifunction='setupEditGlobalObjectOnCreateActionsForm'><span>OnCreate</span></div>"
        result += "</div><div id='editGlobalObjectWindowContent'></div>";
        return result;
    },
    editGlobalObjectPropertiesContent: function(object) {
        var result = '<div id="editGlobalObjectPropertiesContent">';
        if(object.objectType == "activeObject") {
            result += GameCreator.htmlStrings.globalActiveObjectForm(object);
            result += '<div style="height: 10px"></div>';
            if(object.movementType == "free") {
                result += GameCreator.htmlStrings.freeMovementInputs(object);
            }
            else {
                result += GameCreator.htmlStrings.routeMovementInputs(object);
            }
        }
        else if(object.objectType == "mouseObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += '<div style="height: 10px"></div>';
            result += GameCreator.htmlStrings.mouseMovementInputs(object);
        }
        else if(object.objectType == "topDownObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += '<div style="height: 10px"></div>';
            result += GameCreator.htmlStrings.topDownMovementInputs(object);
        }
        else if(object.objectType == "platformObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += '<div style="height: 10px"></div>';
            result += GameCreator.htmlStrings.platformMovementInputs(object);
        }
        result += "</div>";
        result += '<button class="regularButton" id="saveGlobalObjectPropertiesButton">Save</button>';
        return result;
    },
    editGlobalObjectCollisionsContent: function(object) {
        var result = '<div id="editCollisionActionsObjectMenuContainer"><div id="editCollisionActionsObjectMenu">';
        result += '<button id="addNewCollisionButton" class="regularButton">Add</button>';
        for (targetName in object.collisionActions) {
            if (object.collisionActions.hasOwnProperty(targetName)) {
                result += GameCreator.htmlStrings.collisionMenuElement(GameCreator.helperFunctions.findObject(targetName));
            }
        }
        
        result += '</div> \
                   </div><div id="editCollisionActionsObjectContent"></div>';
        return result;
    },
    editGlobalObjectKeyActionsContent: function(object) {
        var result = '<div id="editKeyActionsObjectMenuContainer"><div id="editKeyActionsKeyMenu">';
        result += '<div id="addNewKeyButton" class="regularButton">Add</div>';
        for (keyName in object.keyActions) {
            if(object.keyActions.hasOwnProperty(keyName)) {
                result += GameCreator.htmlStrings.keyMenuElement(keyName);
            }
        }
        result += '</div></div><div id="editKeyActionsKeyContent"></div>';
        return result;
    },
    editGlobalObjectCountersContent: function(object) {
        var result = '<div id="editCountersMenu">';
        result += '<button id="addNewCounterButton" class="regularButton">Add</button>';
        for (counterName in object.counters) {
            if(object.counters.hasOwnProperty(counterName)) {
                result += GameCreator.htmlStrings.counterMenuElement(counterName);
            }
        }
        result += '</div><div id="editCountersCounterContent">'
        result += '<div id="editCounterEventContent"></div>';
        result += '<div id="editCounterEventActionsContent"></div></div>';
        return result;
    },
    freeMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("freeObjectSpeedX", "SpeedX:") +
                GameCreator.htmlStrings.rangeInput("freeObjectSpeedX", "speedX",(object ? object.speedX : "") ) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("freeObjectSpeedY", "SpeedY:") +
                GameCreator.htmlStrings.rangeInput("freeObjectSpeedY", "speedY", (object ? object.speedY : "") ) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("freeObjectAccX", "AccX:") +
                GameCreator.htmlStrings.rangeInput("freeObjectAccX", "accX", (object ? object.accX : "") ) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("freeObjectAccY", "AccY:") +
                GameCreator.htmlStrings.rangeInput("freeObjectAccY", "accY", (object ? object.accY : "") ) +
                '<br style="clear:both;"/>';
    },
    routeMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("routeObjectSpeed", "Speed:") +
            GameCreator.htmlStrings.numberInput("routeObjectSpeed", "speed", (object ? object.speed : "") ) +
            '<br style="clear:both;"/>';
    },
    globalActiveObjectForm: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("activeObjectWidth", "Width:") +
                GameCreator.htmlStrings.rangeInput("activeObjectWidth", "width", object.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("activeObjectHeight", "Height:") +
                GameCreator.htmlStrings.rangeInput("activeObjectHeight", "height", object.height) +
                '<br style="clear:both;"/>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        var result = '<div>' +
                GameCreator.htmlStrings.inputLabel("playerObjectWidth", "Width:") +
                GameCreator.htmlStrings.rangeInput("playerObjectWidth", "width", object.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("playerObjectHeight", "Height:") +
                GameCreator.htmlStrings.rangeInput("playerObjectHeight", "height", object.height) + '</div>' +
                '<br style="clear:both;"/>';
        return result;
    },
    mouseMovementInputs: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("mouseObjectMinX", "Min X:") + GameCreator.htmlStrings.numberInput("mouseObjectMinX", "minX", (object ? object.minX : ""));
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMinX", "Min Y:") + GameCreator.htmlStrings.numberInput("mouseObjectMinY", "minY", (object ? object.minY : ""));
        result += '<br style="clear:both;"/>';
        
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMaxX", "Max X:") + GameCreator.htmlStrings.numberInput("mouseObjectMaxX", "maxX", (object ? object.maxX : ""));
        result += '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMaxX", "Max Y:") + GameCreator.htmlStrings.numberInput("mouseObjectMaxY", "maxY", (object ? object.maxY : ""));
        result += '<br style="clear:both;"/>';
        return result;
    },
    platformMovementInputs: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("platformObjectAccY", "Gravity:") +
            GameCreator.htmlStrings.rangeInput("platformObjectAccY", "accY", (object ? object.accY : "")) +
            '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("platformObjectMaxSpeed", "Speed:") +
            GameCreator.htmlStrings.rangeInput("platformObjectMaxSpeed", "maxSpeed", (object ? object.maxSpeed : "")) +
            '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("platformObjectAcceleration", "Acceleration:") +
            GameCreator.htmlStrings.rangeInput("platformObjectAcceleration", "acceleration", (object ? object.acceleration : "")) +
            '<br style="clear:both;"/>';
        return result;
    },
    topDownMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("topDownObjectMaxSpeed", "Speed:") +
            GameCreator.htmlStrings.rangeInput("topDownObjectMaxSpeed", "maxSpeed", (object ? object.maxSpeed : "")) +
            '<br style="clear:both;"/>';
    },
    
    addActiveObjectForm: function() {
        var result = GameCreator.htmlStrings.inputLabel("activeObjectName", "Name:") + 
            GameCreator.htmlStrings.stringInput("activeObjectName", "name", "") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("activeObjectWidth", "Width:") +
            GameCreator.htmlStrings.rangeInput("activeObjectWidth", "width", "") +
            '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("activeObjectHeight", "Height:") +
            GameCreator.htmlStrings.rangeInput("activeObjectHeight", "height", "") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("activeObjectSrc", "Image Src:") + 
            GameCreator.htmlStrings.stringInput("activeObjectSrc", "src", "http://") + '<br style="clear:both;"/>' +
            GameCreator.htmlStrings.inputLabel("activeObjectMovementType", "Movement:") +
            GameCreator.htmlStrings.singleSelector("activeObjectMovementType", {"Free": "free", "Route": "route"}, "movementType") +
            '<br style="clear:both;"/> \
            <button class="saveButton regularButton">Save</button>';
        return result;
    },
    
    addPlayerObjectForm: function() {
        return 	GameCreator.htmlStrings.inputLabel("playerObjectName", "Name:") + GameCreator.htmlStrings.stringInput("playerObjectName", "name", "") +
        		'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("playerObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("playerObjectWidth", "width", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("playerObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("playerObjectHeight", "height", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("playerObjectSrc", "Image Src:") + GameCreator.htmlStrings.stringInput("playerObjectSrc", "src", "") +
              	'<br style="clear:both;"/>' +
              	GameCreator.htmlStrings.inputLabel("playerObjectType", "Control:") + GameCreator.htmlStrings.singleSelector("playerObjectType", {"Mouse": "addPlayerMouseObject", "Platform": "addPlayerPlatformObject", "Top Down": "addPlayerTopDownObject"}) + '<br style="clear:both;"/>' +
				'<div id="addPlayerObjectMovementParameters"></div><button class="saveButton regularButton">Save</button>'
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
    	result += GameCreator.htmlStrings.inputLabel("counterName", "Name:");
    	result += GameCreator.htmlStrings.stringInput("counterName", "name", "");
    	result += '<button class="saveButton regularButton">Save</button>';
    	return result;
	},
	editCounterEventsContent: function(counter){
		var result = '<button id="addNewCounterEventButton" class="regularButton">Add</button>';
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
		var result = GameCreator.htmlStrings.inputLabel("editCounterEventType", "Type:");
		result += GameCreator.htmlStrings.singleSelector("editCounterEventType", {atValue: "atValue", aboveValue: "aboveValue", belowValue: "belowValue"});
		result += GameCreator.htmlStrings.inputLabel("editCounterEventValue", "Value:");
    	result += GameCreator.htmlStrings.numberInput("editCounterEventValue", "value", "");
    	result += '<button class="saveButton regularButton">Save</button>';
    	return result;
	}
};