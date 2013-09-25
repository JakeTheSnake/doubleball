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
        return '<input id="'+ inputId +'" type="text" data-type="number" data-attrName="' + attrName + '" value="' + value + '"/>'
    },
    inputLabel: function(inputId, labelText) {
        return '<label for=' + inputId + ' class="headingNormal">' + labelText + '</label><br/>';
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
        result += '</span></span></div><div style="clear:both;"></div>';
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
        result += "<label for='editActiveObjectHeight'>Height:</label><input id='editActiveObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editActiveObjectWidth'>Width:</label><input id='editActiveObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        if (object.parent.movementType == "free") {
            result += "<label for='editActiveObjectSpeedX'>SpeedX:</label><input id='editActiveObjectSpeedX' type='text' data-type='number' data-attrName='speedX' value='" + object.speedX + "'></input>";
            result += "<label for='editActiveObjectSpeedY'>SpeedY:</label><input id='editActiveObjectSpeedY' type='text' data-type='number' data-attrName='speedY' value='" + object.speedY + "'></input>";
            result += "<label for='editActiveObjectAccX'>AccX:</label><input id='editActiveObjectAccX' type='text' data-type='number' data-attrName='accX' value='" + object.accX + "'></input>";
            result += "<label for='editActiveObjectAccY'>AccY:</label><input id='editActiveObjectAccY' type='text' data-type='number' data-attrName='accY' value='" + object.accY + "'></input>";
        }
        else if(object.parent.movementType == "route") {
            result += "<label for='editActiveObjectSpeed'>Speed:</label><input id='editActiveObjectSpeed' type='text' data-type='number' data-attrName='speed' value='" + object.speed + "'></input>"
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
        result += "<label for='editMouseObjectHeight'>Height:</label><input id='editMouseObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editMouseObjectWidth'>Width:</label><input id='editMouseObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editPlatformObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += "<label for='editPlatformObjectHeight'>Height:</label><input id='editPlatformObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editPlatformObjectWidth'>Width:</label><input id='editPlatformObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        
        result += '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)"  class="regularButton">Save</button></div>';
        return result += '<button id="deleteSceneObjectButton" onClick="GameCreator.deleteSelectedObject()" class="regularButton">Delete</button></div>'
    },
    editTopDownObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += "<label for='editTopDownObjectHeight'>Height:</label><input id='editTopDownObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editTopDownObjectWidth'>Width:</label><input id='editTopDownObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
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
        <div id="selectActionResult">';
        for (var i = 0; i < existingActions.length; i++) {
            var action = existingActions[i];
            var selectedAction = {action: action.action, parameters: {}};

            result += GameCreator.htmlStrings.actionRow(existingActions[i].name, selectedAction);
        }
        result += ' \
                </div></div> \
        <div class="dialogueButtons"><button class="cancelButton" id="editActionsWindowCancel">Cancel</button></div></div>';
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
        return '<label for="freeObjectSpeedX">SpeedX:</label><input id="freeObjectSpeedX" type="text" data-type="number" data-attrName="speedX" value="' + (object ? object.speedX : "") + '"></input> \
                <label for="freeObjectSpeedY">SpeedY:</label><input id="freeObjectSpeedY" type="text" data-type="number" data-attrName="speedY" value="' + (object ? object.speedY : "") + '"></input> \
                <label for="freeObjectAccX">AccX:</label><input id="freeObjectAccX" type="text" data-type="number" data-attrName="accX" value="' + (object ? object.accX : "") + '"></input> \
                <label for="freeObjectAccY">AccY:</label><input id="freeObjectAccY" type="text" data-type="number" data-attrName="accY" value="' + (object ? object.accY : "") + '"></input>';
    },
    routeMovementInputs: function(object) {
        return '<label for="routeObjectSpeed">Speed:</label><input id="routeObjectSpeed" type="text" data-type="number" data-attrName="speed" value="' + (object ? object.speed : "") + '"></input>'
    },
    globalActiveObjectForm: function(object) {
        var result = '<div><label for="activeObjectWidth">Width:</label><input id="addActiveObjectWidth" type="text" data-type="number" data-attrName="width" value="' + object.width + '"></input> \
                      <label for="activeObjectHeight">Height:</label><input id="addActiveObjectHeight" type="text" data-type="number" data-attrName="height" value="' + object.height + '"></input></div>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        var result = '<div><label for="playerObjectWidth">Width:</label><input id="addPlayerObjectWidth" type="text" data-type="number" data-attrName="width" value="' + object.width + '"></input> \
                      <label for="playerObjectHeight">Height:</label><input id="addPlayerObjectHeight" type="text" data-type="number" data-attrName="height" value="' + object.height + '"></input></div>';
        return result;
    },
    mouseMovementInputs: function(object) {
        result = "<label for='mouseObjectMinX'>Min X:</label><input id='mouseObjectMinX' type='text' data-type='number' data-attrName='minX' value='" + (object ? object.minX : "") + "'></input>";
        result += "<label for='mouseObjectMinY'>Min Y:</label><input id='mouseObjectMinY' type='text' data-type='number' data-attrName='minY' value='" + (object ? object.minY : "") + "'></input>";
        
        result += "<label for='mouseObjectMaxX'>Max X:</label><input id='mouseObjectMaxX' type='text' data-type='number' data-attrName='maxX' value='" + (object ? object.maxX : "") + "'></input>";
        result += "<label for='mouseObjectMaxY'>Max Y:</label><input id='mouseObjectMaxY' type='text' data-type='number' data-attrName='maxY' value='" + (object ? object.maxY : "") + "'></input>";
        return result;
    },
    platformMovementInputs: function(object) {
        result = "<label for='platformObjectAccY'>Gravity:</label><input id='platformObjectAccY' type='text' data-type='number' data-attrName='accY' value='" + (object ? object.accY : "") + "'></input>";
        result += "<label for='platformObjectMaxSpeed'>Speed:</label><input id='platformObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + (object ? object.maxSpeed : "") + "'></input>";
        result += "<label for='platformObjectAcceleration'>Acceleration:</label><input id='platformObjectAcceleration' type='text' data-type='number' data-attrName='acceleration' value='" + (object ? object.acceleration : "") + "'></input>";
        return result;
    },
    topDownMovementInputs: function(object) {
        return "<label for='topDownObjectMaxSpeed'>Speed:</label><input id='topDownObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + (object ? object.maxSpeed : "") + "'></input>";
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