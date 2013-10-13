GameCreator.htmlStrings = {
    singleSelector: function(elementId, collection) {
        var result = '<div><select id="' + elementId + '" data-type="text">';
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
        return '<div class="collisionMenuElement headingNormalBlack" data-name="' + object.name + '" ><span>' + object.name + '</span>' + 
        object.image.outerHTML + '</div>';
    },
    keyMenuElement: function(keyName) {
        return '<div class="keyMenuElement" data-name="' + keyName + '"><span>' + keyName + '</span></div>';
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
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editMouseObjectHeight", "height", object.height);;
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editMouseObjectWidth", "width", object.width);;
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveFormInputToObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editPlatformObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editPlatformObjectHeight", "height", object.height);;
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editPlatformObjectWidth", "width", object.width);;
        
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveFormInputToObject(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editTopDownObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectHeight", "Height:") + GameCreator.htmlStrings.rangeInput("editTopDownObjectHeight", "height", object.height);
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectWidth", "Width:") + GameCreator.htmlStrings.rangeInput("editTopDownObjectWidth", "width", object.width);
        
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
        result = "";
        result += '<div id="selectActionWindow" style="height: 100%"> \
        <div id="selectActionsHeader" class="dialogueHeader">' + description + '</div> \
        <div id="selectActionsContent" class="dialogueContent">\
            <span style="display: inline-block;"><div id="selectActionDropdownContainer" class="group"><div class="groupHeading">Action</div>' + GameCreator.htmlStrings.singleSelector("actionSelector", actions) + '</div>\
            <div id="selectActionParametersContainer" class="group" style="display:none;"><div class="groupHeading">Parameters</div>\
            <div id="selectActionParametersContent"></div></div> \
            <div id="selectActionAddButton"><button id="selectActionAddAction" class="regularButton addActionButton">Add</button></div>\
            </span>'
        
        result += '<div id="selectActionResult">';
        result += GameCreator.htmlStrings.selectedActionsList(existingActions);
        result += '</div></div><div class="dialogueButtons"><button class="cancelButton" id="editActionsWindowCancel">Cancel</button></div></div>';
        return result;
    },
    selectedActionsList: function(existingActions) {
        result = "";
        for (var i = 0; i < existingActions.length; i++) {
            var action = existingActions[i];
            var selectedAction = {action: action.action, parameters: {}};

            result += GameCreator.htmlStrings.actionRow(existingActions[i].name, selectedAction);
        }
        return result;
    },
    addGlobalObjectWindow: function() {
        result = "";
        result += "<div id='editGlobalObjectTabContainer' class='tabContainer'>\
                    <div class='tab' data-uifunction='setupAddActiveObjectForm'><span>Active Object</span></div> \
                   <div class='tab' data-uifunction='setupAddPlayerObjectForm'><span>Player Object<span></div></div> \
                   <div id='addGlobalObjectWindowContent'></div>";
        return result;
    },
    editGlobalObjectWindow: function(object) {
        result = "";
        //The tabs here should depend on the kind of object. For now we just show them all.
        result += "<div id='editGlobalObjectTabContainer' class='tabContainer'>";
        result += "<div class='tab' data-uifunction='setupEditGlobalObjectPropertiesForm'><span>Properties</span></div>";
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectCollisionsForm'><span>Collisions<span></div>";
        }
        if (["topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectKeyActionsForm'><span>Key Actions</span></div>";
        }
        if (["activeObject", "topDownObject", "mouseObject", "platformObject"].indexOf(object.objectType) != -1) {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectOnClickActionsForm'><span>OnClick<span></div>";
        }
        if (object.objectType == "timerObject") {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectTimerActionsForm'><span>Timer Actions</span></div>";
        }
        if(object.objectType == "counterObject") {
            result += "<div class='tab' data-uifunction='setupEditGlobalObjectCounterActionsForm'><span>Counter Actions</span></div>";
        }
        result += "</div><div id='editGlobalObjectWindowContent'></div>";
        return result;
    },
    editGlobalObjectPropertiesContent: function(object) {
        var result = '<div id="editGlobalObjectPropertiesContent">';
        if(object.objectType == "activeObject") {
            result += GameCreator.htmlStrings.globalActiveObjectForm(object);
            if(object.movementType == "free") {
                result += GameCreator.htmlStrings.freeMovementInputs(object);
            }
            else {
                result += GameCreator.htmlStrings.routeMovementInputs(object);
            }
        }
        else if(object.objectType == "mouseObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += GameCreator.htmlStrings.mouseMovementInputs(object);
        }
        else if(object.objectType == "topDownObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += GameCreator.htmlStrings.topDownMovementInputs(object);
        }
        else if(object.objectType == "platformObject") {
            result += GameCreator.htmlStrings.globalPlayerObjectForm(object);
            result += GameCreator.htmlStrings.platformMovementInputs(object);
        }
        result += "</div>";
        result += '<button class="regularButton" id="saveGlobalObjectPropertiesButton">Save</button>';
        return result;
    },
    editGlobalObjectCollisionsContent: function(object) {
        result = '<div id="editCollisionActionsObjectMenu">';
        result += '<button id="addNewCollisionButton" class="regularButton">Add</button>';
        for (targetName in object.collisionActions) {
            if (object.collisionActions.hasOwnProperty(targetName)) {
                result += GameCreator.htmlStrings.collisionMenuElement(GameCreator.helperFunctions.findObject(targetName));
            }
        }
        
        result += '</div> \
                   <div id="editCollisionActionsObjectContent"></div>';
        return result;
    },
    editGlobalObjectKeyActionsContent: function(object) {
        result = '<div id="editKeyActionsKeyMenu">';
        for (keyName in object.keyActions) {
            if(object.keyActions.hasOwnProperty(keyName)) {
                result += GameCreator.htmlStrings.keyMenuElement(keyName);
            }
        }
        result += '<div id="addNewKeyButton" style="width:65px;height:65px;background-color:#777;cursor: pointer;">+</div>';
        result += '</div><div id="editKeyActionsKeyContent"></div>';
        return result;
    },
    
    editGlobalObjectTimerActionsContent: function(object) {
        return "Timer Actions";
    },
    editGlobalObjectCounterActionsContent: function(object) {
        return "Counter Actions";
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
        var result = '<div>' + GameCreator.htmlStrings.inputLabel("activeObjectWidth", "Width:") +
                    GameCreator.htmlStrings.rangeInput("activeObjectWidth", "width", object.width) +
                    '<br style="clear:both;"/>' +
                    GameCreator.htmlStrings.inputLabel("activeObjectHeight", "Height:") +
                    GameCreator.htmlStrings.rangeInput("activeObjectHeight", "height", object.height) + '<br style="clear:both;"/></div>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        var result = '<div>' + GameCreator.htmlStrings.inputLabel("playerObjectWidth", "Width:") +
                GameCreator.htmlStrings.rangeInput("playerObjectWidth", "width", object.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("playerObjectHeight", "Height:") +
                GameCreator.htmlStrings.rangeInput("playerObjectHeight", "height", object.height) + '</div>' +
                '<br style="clear:both;"/>';
        return result;
    },
    mouseMovementInputs: function(object) {
        var result = GameCreator.htmlStrings.inputLabel("mouseObjectMinX", "Min X:") + GameCreator.htmlStrings.numberInput("mouseObjectMinX", "minX", (object ? object.minX : ""));
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMinX", "Min Y:") + GameCreator.htmlStrings.numberInput("mouseObjectMinY", "minY", (object ? object.minY : ""));
        result += '<br style="clear:both;"/>';
        
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMaxX", "Max X:") + GameCreator.htmlStrings.numberInput("mouseObjectMaxX", "maxX", (object ? object.maxX : ""));
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
            GameCreator.htmlStrings.singleSelector("activeObjectMovementType", {"Free": "free", "Route": "route"}) +
            '<br style="clear:both;"/> \
            <button class="saveButton regularButton">Save</button>';
        return result;
    },
    
    addPlayerObjectForm: function() {
        return '<div><label for="playerObjectName">Name:</label><input id="playerObjectName" type="text"></input></div> \
              <div><label for="playerObjectWidth">Width:</label><input id="playerObjectWidth" type="text"></input> \
              <label for="playerObjectHeight">Height:</label><input id="playerObjectHeight" type="text"></input></div> \
              <div><label for="playerObjectSrc" type="text">Image Src:</label><input id="playerObjectSrc" type="text"></label></div> \
              <div><label for="playerObjectType" type="select">Control:</label><select id="playerObjectType"> \
              <option value="addPlayerMouseObject">Mouse</option><option value="addPlayerPlatformObject">Platform</option><option value="addPlayerTopDownObject">Top Down</option> \
              </select></div><div id="addPlayerObjectMovementParameters"></div> \
              <button class="saveButton regularButton">Save</button>'
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
    }
};