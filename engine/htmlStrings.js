GameCreator.htmlStrings = {
    singleSelector: function(elementId, collection, attrName, selectedKey) {
        var result = '<select class="selectorField" id="' + elementId + '" data-type="text"';
        if (attrName) {
        	result += ' data-attrName="' + attrName + '">'
        } else {
        	result += '>'
        }
        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helpers.toString(collection[key]) + "'" + (selectedKey === key ? " selected" : "") + ">" + key + "</option>";
            }
        };
        result += "</select>";
        return result;
    },

    numberInput: function(attrName, value) {
        return '<input type="text" class="numberField" data-type="number" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },

    globalObjectInput: function(attrName, value) {
        return '<input type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },

    stringInput: function(attrName, value) {
        return '<input type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },

    rangeInput: function(attrName, value) {
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
        return '<input type="text" class="rangeField" data-type="range" data-attrName="' + attrName + '" value="' + (valueString === undefined ? '' : valueString) + '"/>'
    },

    checkboxInput: function(inputId, attrName, checked) {
        return '<input id="'+ inputId +'" type="checkbox" class="checkboxField" data-type="checkbox" data-attrName="' +
            attrName + '" ' + (checked ? 'checked' : '') + ' />'
    },

    imageInput: function(inputId, attrName, value) {
        return '<input id="'+ inputId +'" type="text" class="textField" data-type="image" data-attrName="' + attrName + '" value="' + (value ? value.src : '') + '"/>'
    },

    inputLabel: function(labelText) {
        return '<label>' + labelText + '</label>';
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
        object.getDefaultState().attributes.image.outerHTML + '</div>';
    },

    keyMenuElement: function(keyName) {
        return '<li class="keyMenuElement" data-name="' + keyName + '">' + keyName + '</li>';
    },

    counterMenuElement: function(counterName) {
        return '<li class="counterMenuElement headingNormalBlack" data-name="' + counterName + '"><span>' + counterName + '</span></li>';
    },

    counterEventMenuElement: function(value, type) {
    	return '<li class="counterEventMenuElement headingNormalBlack" data-value="' + value + '" data-type="' + type + '"><span>' + type + " " + value+ '</span></li>';
    },

    globalObjectElement: function(object) {
        var image = object.getDefaultState().image;
        $(image).css("width","65");
        var imgDiv = $(document.createElement("div"));
        imgDiv.append(image);
        imgDiv.addClass("global-object-element-image");

        var div = $(document.createElement("div")).append(imgDiv);
        $(div).attr("id", "object-library-element-" + object.objectName);
        return div;
    },

    globalObjectLibraryItem: function(object) {
        var libraryItem = document.createElement("li");
        $(libraryItem).append(object.objectName);
        $(libraryItem).addClass("library-global-object-button");
        $(libraryItem).attr("data-imgsrc", object.getDefaultState().attributes.image.src);
        return libraryItem;
    },

    routeNode: function(node, index) {
        var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.mainCanvas.offsetTop) + "px;left:" + (node.x + GameCreator.mainCanvas.offsetLeft) + "px;'><div class='routeNode' data-index='" + index + "'> \
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

    addGlobalObjectWindow: function() {
        var result = "";

        result += '<div id="dialogue-window-title">Add new object</div> \
                   <div id="dialogue-window-menu"> \
                   <a class="tab dialogue-window-tab active" data-object-type="FreeObject">Free object</a> \
                   <a class="tab dialogue-window-tab" data-object-type="RouteObject">Route object</a> \
                   <a class="tab dialogue-window-tab" data-object-type="PlatformObject">Platform object</a> \
                   <a class="tab dialogue-window-tab" data-object-type="TopDownObject">Top-down object</a> \
                   <a class="tab dialogue-window-tab" data-object-type="MouseObject">Mouse object</a> \
                   <a class="tab dialogue-window-tab" data-object-type="CounterObjectImage">Counter object image</a> \
                   <a class="tab dialogue-window-tab" data-object-type="CounterObjectText">Counter object text</a> \
                   </div> \
                   <div id="add-global-object-window-content"></div>';
        return result;
    },

    addGlobalObjectForm: function(objectType) {
        var result = GameCreator.htmlStrings.inputLabel('global-object-name', 'Name ') +
                GameCreator.htmlStrings.stringInput('global-object-name', 'objectName') +
                '<br style="clear:both;"/>';
        result += GameCreator.helpers.getAttributeForm(GameCreator[objectType].objectAttributes,
            GameCreator[objectType].objectAttributes);
        result += GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique ') +
                GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique') +
                '<br style="clear:both;"/>' +
                '<button class="saveButton regularButton">Save</button>';
        return result;       
    },
    
    collisionObjectSelector: function(object) {
        var result = '';
        var selectableObjects = {};
        var objName, objId;
        $.extend(selectableObjects, GameCreator.globalObjects, GameCreator.borderObjects);
        for (objName in selectableObjects) {
            objId = GameCreator.helpers.findGlobalObjectByName(objName).id;
            if (selectableObjects.hasOwnProperty(objName) && 
                !GameCreator.helpers.getObjectById(object.onCollideEvents, objId) && 
                selectableObjects[objName].isCollidable && 
                objName != object.objectName) {
                result += '<div class="addCollisionObjectElement" data-objectname="' + objName + '" style="float:left;cursor:pointer">' + selectableObjects[objName].getDefaultState().attributes.image.outerHTML + '</br><span>' + objName + '</span></div>';
            }
        }
    	return result;
	},
    
    createCounterForm: function(inputId) {
    	var result = '<div>'
    	result += GameCreator.htmlStrings.inputLabel(inputId, "Name:");
    	result += GameCreator.htmlStrings.stringInput(inputId, "name", "");
    	result += '<button class="saveButton regularButton">Save</button>';
        result += '</div>'
    	return result;
	},
	
	createCounterEventForm: function() {
		var result = '<div>' + GameCreator.htmlStrings.inputLabel("edit-counter-event-type", "Type:");
		result += GameCreator.htmlStrings.singleSelector("edit-counter-event-type", {atValue: "atValue", aboveValue: "aboveValue", belowValue: "belowValue"});
		result += GameCreator.htmlStrings.inputLabel("edit-counter-event-value", "Value:");
    	result += GameCreator.htmlStrings.numberInput("edit-counter-event-value", "value", "");
    	result += '<button class="saveButton regularButton">Save</button>';
        result += '</div>';
    	return result;
	},
    
    debugInformation: function(info) {
        var result = '';
        for(var key in info){
            if (info.hasOwnProperty(key)) {
                result += '<span>' + key + ': ' + info[key] + '</span><br/>';
            }
        }
        return result;
    },

	sceneTab: function(scene, sceneActive) {
        return '<li class="tab ' + (sceneActive ? 'active' : '')  + '" data-sceneid="' + scene.id + '">' + scene.attributes.name + '</li>';
	},

	addSceneTab: function() {
        return '<li id="add-scene-tab">+</li>';
	},

    sceneObjectForm: function(sceneObject) {
 
    },

    getColumn: function(title, id) {
        var result = "";
        var i;

        result += '<div class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">' + title + '</span> \
                   </div> \
                   <ul id="' + id + '" class="nav nav-tabs nav-stacked"> \
                   </ul> \
                   </div>';
                   
        return result;
    },

};