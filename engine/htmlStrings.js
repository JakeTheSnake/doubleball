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
        return '<input id="'+ inputId +'" type="text" class="textField" data-type="number" data-attrName="' + attrName + '" value="' + value + '"/>'
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
        return '<div class="collisionMenuElement" data-name="' + object.name + '" ><span>' + object.name + '</span>' + object.image.outerHTML + '</div>';
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
        GameCreator.htmlStrings.numberInput("editActiveObjectHeight", "height", object.height) + '<br style="clear:both;"/>';
        result += GameCreator.htmlStrings.inputLabel("editActiveObjectWidth", "Width:") +
            GameCreator.htmlStrings.numberInput("editActiveObjectWidth", "width", object.width) + '<br style="clear:both;"/>';
        if (object.parent.movementType == "free") {
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeedX", "SpeedX:") + 
            GameCreator.htmlStrings.numberInput("editActiveObjectSpeedX", "speedX", object.speedX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeedY", "SpeedY:") + 
            GameCreator.htmlStrings.numberInput("editActiveObjectSpeedY", "speedY", object.speedY) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectAccX", "AccX:") + 
            GameCreator.htmlStrings.numberInput("editActiveObjectAccX", "accX", object.accX) + '<br style="clear:both;"/>';
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectAccY", "AccY:") + 
            GameCreator.htmlStrings.numberInput("editActiveObjectAccY", "accY", object.accY) + '<br style="clear:both;"/>';
        }
        else if(object.parent.movementType == "route") {
            result += GameCreator.htmlStrings.inputLabel("editActiveObjectSpeed", "Speed:") + GameCreator.htmlStrings.numberInput("editActiveObjectSpeed", "speed", object.speed);
            result += "<label for='editActiveObjectStartNode'>Starting Node</label><select id='editActiveObjectStartNode' data-type='number' data-attrName='targetNode'>";
            for (var i = 0; i < object.route.length; i++) {
                result += "<option value='" + i + "'" + (object.targetNode == i ? 'selected' : '') + ">" + (i + 1) + "</option>";
            }
            result += "</select><br/>";
            result += "<label for='editActiveObjectRouteDirection'>Direction</label><select id='editActiveObjectRouteDirection' data-type='bool' data-attrName='routeForward'> \
                <option value='true'" + (object.routeForward ? 'selected' : '') + ">Forward</option><option value='false'" + (!object.routeForward ? 'selected' : '') + ">Backward</option></select>";
            result += "<a href='' onclick='GameCreator.drawRoute(GameCreator.selectedObject.route);return false;'>Edit route</a>";
        }
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editMouseObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectHeight", "Height:") + GameCreator.htmlStrings.numberInput("editMouseObjectHeight", "height", object.height);;
        result +=GameCreator.htmlStrings.inputLabel("editMouseObjectWidth", "Width:") + GameCreator.htmlStrings.numberInput("editMouseObjectWidth", "width", object.width);;
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editPlatformObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectHeight", "Height:") + GameCreator.htmlStrings.numberInput("editPlatformObjectHeight", "height", object.height);;
        result +=GameCreator.htmlStrings.inputLabel("editPlatformObjectWidth", "Width:") + GameCreator.htmlStrings.numberInput("editPlatformObjectWidth", "width", object.width);;
        
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editTopDownObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectHeight", "Height:") + GameCreator.htmlStrings.numberInput("editTopDownObjectHeight", "height", object.height);
        result +=GameCreator.htmlStrings.inputLabel("editTopDownObjectWidth", "Width:") + GameCreator.htmlStrings.numberInput("editTopDownObjectWidth", "width", object.width);
        
        result += GameCreator.htmlStrings.topDownMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
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
            </span>\
        </div>'
        result += '<div id="selectActionResult">';
        result += GameCreator.htmlStrings.selectedActionsList(existingActions);
        result += '</div><div class="dialogueButtons"><button class="cancelButton" id="editActionsWindowCancel">Cancel</button></div></div>';
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
        for (targetName in object.collisionActions) {
            if (object.collisionActions.hasOwnProperty(targetName)) {
                result += GameCreator.htmlStrings.collisionMenuElement(GameCreator.helperFunctions.findObject(targetName));
            }
        }
        result += '<div id="addNewCollisionButton" style="width:65px;height:65px;background-color:#777;cursor: pointer;">+</div>';
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
        return GameCreator.htmlStrings.inputLabel("freeObjectSpeedX", "SpeedX:") + GameCreator.htmlStrings.numberInput("freeObjectSpeedX", "speedX",(object ? object.speedX : "") ) +
                GameCreator.htmlStrings.inputLabel("freeObjectSpeedY", "SpeedY:") + GameCreator.htmlStrings.numberInput("freeObjectSpeedY", "speedY", (object ? object.speedY : "") ) +
                GameCreator.htmlStrings.inputLabel("freeObjectAccX", "AccX:") + GameCreator.htmlStrings.numberInput("freeObjectAccX", "accX", (object ? object.accX : "") ) +
                GameCreator.htmlStrings.inputLabel("freeObjectAccY", "AccY:") + GameCreator.htmlStrings.numberInput("freeObjectAccY", "accY", (object ? object.accY : "") );
    },
    routeMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("routeObjectSpeed", "Speed:") + GameCreator.htmlStrings.numberInput("routeObjectSpeed", "speed", (object ? object.speed : "") )
    },
    globalActiveObjectForm: function(object) {
        var result = '<div>' + GameCreator.htmlStrings.inputLabel("activeObjectWidth", "Width:") + GameCreator.htmlStrings.numberInput("activeObjectWidth", "width", object.width) +
                      GameCreator.htmlStrings.inputLabel("activeObjectHeight", "Height:") + GameCreator.htmlStrings.numberInput("activeObjectHeight", "height", object.height) + '</div>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        var result = '<div>' + GameCreator.htmlStrings.inputLabel("playerObjectWidth", "Width:") + GameCreator.htmlStrings.numberInput("playerObjectWidth", "width", object.width) +
                      GameCreator.htmlStrings.inputLabel("playerObjectHeight", "Height:") + GameCreator.htmlStrings.numberInput("playerObjectHeight", "height", object.height) + '</div>';
        return result;
    },
    mouseMovementInputs: function(object) {
        result = GameCreator.htmlStrings.inputLabel("mouseObjectMinX", "Min X:") + GameCreator.htmlStrings.numberInput("mouseObjectMinX", "minX", (object ? object.minX : ""));
        result += GameCreator.htmlStrings.inputIdLabel("mouseObjectMinX", "Min Y:") + GameCreator.htmlStrings.numberInput("mouseObjectMinY", "minY", (object ? object.minY : ""));
        
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMaxX", "Max X:") + GameCreator.htmlStrings.numberInput("mouseObjectMaxX", "maxX", (object ? object.maxX : ""));
        result += GameCreator.htmlStrings.inputLabel("mouseObjectMaxX", "Max Y:") + GameCreator.htmlStrings.numberInput("mouseObjectMaxY", "maxY", (object ? object.maxY : ""));
        return result;
    },
    platformMovementInputs: function(object) {
        result = GameCreator.htmlStrings.inputLabel("platformObjectAccY", "Gravity:") + GameCreator.htmlStrings.numberInput("platformObjectAccY", "accY", (object ? object.accY : ""));
        result += GameCreator.htmlStrings.inputLabel("platformObjectMaxSpeed", "Speed:") + GameCreator.htmlStrings.numberInput("platformObjectMaxSpeed", "maxSpeed", (object ? object.maxSpeed : ""));
        result += GameCreator.htmlStrings.inputLabel("platformObjectAcceleration", "Acceleration:") + GameCreator.htmlStrings.numberInput("platformObjectAcceleration", "acceleration", (object ? object.acceleration : ""));
        return result;
    },
    topDownMovementInputs: function(object) {
        return GameCreator.htmlStrings.inputLabel("topDownObjectMaxSpeed", "Speed:") + GameCreator.htmlStrings.numberInput("topDownObjectMaxSpeed", "maxSpeed", (object ? object.maxSpeed : ""));
    },
    
    addActiveObjectForm: function() {
        return '<div><label for="activeObjectName">Name:</label><input id="activeObjectName" type="text"></input></div> \
                <div><label for="activeObjectWidth">Width:</label><input id="activeObjectWidth" type="text"></input> \
                <label for="activeObjectHeight">Height:</label><input id="activeObjectHeight" type="text"></input></div> \
                <div><label for="activeObjectSrc" type="text">Image Src:</label><input id="activeObjectSrc" type="text"></label></div> \
                <div><label for="activeObjectMovementType">Movement type:</label> \
                <select id="activeObjectMovementType"><option value="free">Free</option><option value="route">Route</option></select></div> \
                <div id="addActiveObjectMovementParameters"></div> \
                <button class="saveButton regularButton">Save</button>'
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
    	result = '';
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