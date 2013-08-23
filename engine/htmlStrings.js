GameCreator.htmlStrings = {
    singleSelector: function(collection, elementId) {
        if(elementId == undefined)
            elementId = "actionSelector"
        var result = "<div><select id='" + elementId + "'>";
        for (key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helperFunctions.toString(collection[key]) + "'>" + key + "</option>";
            }
        };
        result += "</select></div>";
        return result;
    },
    inputLabel: function(inputId, labelText) {
        return "<label for=" + inputId + ">" + labelText + "</label>";
    },
    actionRow: function(name, action) {
        var result = "<div>" + name + " ";
        for (key in action.parameters) {
            if (action.parameters.hasOwnProperty(key)) {
                result += key + ": " + action.parameters[key];
            }
        }
        result += "</div>";
        return result;
    },
    globalObjectElement: function(object) {
        var image = object.image;
        $(image).css("width","65");
        var span = $(document.createElement("span")).append(object.name);
        var div = $(document.createElement("div")).append(span).append(image);
        $(div).attr("id", "globalObjectElement_" + object.name);
        return div;
    },
    globalObjectEditButton: function(object) {
        var button = document.createElement("button");
        $(button).append("Edit");
        var div = $(document.createElement("div")).append(button);
        $(div).css("border-bottom","solid 1px");
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
        return result + '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)">Save</button></div>';
    },
    editMouseObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += "<label for='editMouseObjectHeight'>Height:</label><input id='editMouseObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editMouseObjectWidth'>Width:</label><input id='editMouseObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
        result += GameCreator.htmlStrings.mouseMovementInputs(object);
        
        return result + '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)">Save</button></div>';
    },
    editPlatformObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += "<label for='editPlatformObjectHeight'>Height:</label><input id='editPlatformObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editPlatformObjectWidth'>Width:</label><input id='editPlatformObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
        result += GameCreator.htmlStrings.platformMovementInputs(object);
        
        return result + '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)">Save</button></div>';
    },
    editTopDownObjectForm: function(object) {
        var result = "<div id='editSceneObjectForm'>";
        result += "<label for='editTopDownObjectHeight'>Height:</label><input id='editTopDownObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
        result += "<label for='editTopDownObjectWidth'>Width:</label><input id='editTopDownObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
        
        result += GameCreator.htmlStrings.topDownMovementInputs(object);
        
        return result + '<button id="saveSceneObjectButton" onClick="GameCreator.saveObjectChanges(\'editSceneObjectForm\', GameCreator.selectedObject)">Save</button></div>';
    },
    routeNode: function(node, index) {
        var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.canvasOffsetY) + "px;left:" + (node.x + GameCreator.canvasOffsetX) + "px;'><div class='routeNode' data-index='" + index + "'> \
            <span class='routeNodeLabel'>" + (index + 1) + "</span></div> \
            <div class='nodeActions'><a href='' onclick='GameCreator.selectedObject.insertNode(" + index + "); return false;'>+</a>";
        if(index != 0) {    
            result += "<a href='' onclick='GameCreator.selectedObject.removeNode(" + index + "); return false;'>X</a></div></div>";
        }
        return result;
    },
    editGlobalObjectWindow: function(object) {
        result = "";
        //The tabs here should depend on the kind of object. For now we just show them all.
        result += "<div id='editGlobalObjectTabContainer'><div class='editGlobalObjectTab' data-htmlString='editGlobalObjectPropertiesContent'><span>Properties</span></div> \
        <div class='editGlobalObjectTab' data-htmlString='editGlobalObjectCollisionsContent'><span>Collisions<span></div> \
        <div class='editGlobalObjectTab' data-htmlString='editGlobalObjectKeyActionsContent'><span>Key Actions</span></div> \
        <div class='editGlobalObjectTab' data-htmlString='editGlobalObjectTimerActionsContent'><span>Timer Actions</span></div> \
        <div class='editGlobalObjectTab' data-htmlString='editGlobalObjectCounterActionsContent'><span>Counter Actions</span></div></div> \
        <div id='editGlobalObjectWindowContent'></div>";
        return result;
    },
    editGlobalObjectPropertiesContent: function(object) {
        var result = '<div id="editGlobalObjectContent">';
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
            results += GameCreator.htmlStrings.mouseMovementInputs(object);
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
        result += '<button id="saveGlobalActiveObjectButton" onClick="GameCreator.saveObjectChanges(\'editGlobalObjectContent\', GameCreator.selectedGlobalObject)">Save</button>';
        return result;
    },
    editGlobalObjectCollisionsContent: function(object) {
        result = "Collisions!";
        for (colName in object.collisionActions) {
            if (object.collisionActions.hasOwnProperty(colName)) {
                result += "<div><span data-objectName='" + object.name + "'>" + object.name + "</span></div>"
            }
        };
        return result;
    },
    editGlobalObjectKeyActionsContent: function(object) {
        return "KeyActions!";
    },
    editGlobalObjectTimerActionsContent: function(object) {
        return "Timer Actions";
    },
    editGlobalObjectCounterActionsContent: function(object) {
        return "Counter Actions";
    },
    freeMovementInputs: function(object) {
        return '<label for="addObjectSpeedX">SpeedX:</label><input id="addObjectSpeedX" type="text" data-type="number" data-attrName="speedX" value="' + object.speedX + '"></input> \
                <label for="addObjectSpeedY">SpeedY:</label><input id="addObjectSpeedY" type="text" data-type="number" data-attrName="speedY" value="' + object.speedY + '"></input> \
                <label for="addObjectAccX">AccX:</label><input id="addObjectAccX" type="text" data-type="number" data-attrName="accX" value="' + object.accX + '"></input> \
                <label for="addObjectAccY">AccY:</label><input id="addObjectAccY" type="text" data-type="number" data-attrName="accY" value="' + object.accY + '"></input>';
    },
    routeMovementInputs: function(object) {
        return '<label for="addObjectSpeed">Speed:</label><input id="addObjectSpeed" type="text" data-type="number" data-attrName="speed" value="' + object.speed + '"></input>'
    },
    globalActiveObjectForm: function(object) {
        var result = '<div><label for="addActiveObjectWidth">Width:</label><input id="addActiveObjectWidth" type="text" data-type="number" data-attrName="width" value="' + object.width + '"></input> \
                      <label for="addActiveObjectHeight">Height:</label><input id="addActiveObjectHeight" type="text" data-type="number" data-attrName="height" value="' + object.height + '"></input></div>';
        return result;
    },
    globalPlayerObjectForm: function(object) {
        console.log(object)
        var result = '<div><label for="addPlayerObjectWidth">Width:</label><input id="addPlayerObjectWidth" type="text" data-type="number" data-attrName="width" value="' + object.width + '"></input> \
                      <label for="addPlayerObjectHeight">Height:</label><input id="addPlayerObjectHeight" type="text" data-type="number" data-attrName="height" value="' + object.height + '"></input></div>';
        return result;
    },
    mouseMovementInputs: function(object) {
        result = "<label for='editMouseObjectMinX'>Min X:</label><input id='editMouseObjectMinX' type='text' data-type='number' data-attrName='minX' value='" + object.minX + "'></input>";
        result += "<label for='editMouseObjectMinY'>Min Y:</label><input id='editMouseObjectMinY' type='text' data-type='number' data-attrName='minY' value='" + object.minY + "'></input>";
        
        result += "<label for='editMouseObjectMaxX'>Max X:</label><input id='editMouseObjectMaxX' type='text' data-type='number' data-attrName='maxX' value='" + object.maxX + "'></input>";
        result += "<label for='editMouseObjectMaxY'>Max Y:</label><input id='editMouseObjectMaxY' type='text' data-type='number' data-attrName='maxY' value='" + object.maxY + "'></input>";
        return result;
    },
    platformMovementInputs: function(object) {
        result = "<label for='editPlatformObjectAccY'>Gravity:</label><input id='editPlatformObjectAccY' type='text' data-type='number' data-attrName='accY' value='" + object.accY + "'></input>";
        result += "<label for='editPlatformObjectMaxSpeed'>Speed:</label><input id='editPlatformObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + object.maxSpeed + "'></input>";
        result += "<label for='editPlatformObjectAcceleration'>Acceleration:</label><input id='editPlatformObjectAcceleration' type='text' data-type='number' data-attrName='acceleration' value='" + object.acceleration + "'></input>";
        return result;
    },
    topDownMovementInputs: function(object) {
        return "<label for='editTopDownObjectMaxSpeed'>Speed:</label><input id='editTopDownObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + object.maxSpeed + "'></input>";
    }
};