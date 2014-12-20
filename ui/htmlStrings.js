GameCreator.htmlStrings = {
    singleSelector: function(collection, attrName, selectedValue) {
        var result = '<select class="selectorField" data-type="string"';
        if (attrName) {
        	result += ' data-attrName="' + attrName + '">'
        } else {
        	result += '>'
        }
        for (var key in collection) {
            if (collection.hasOwnProperty(key)) {
                result += "<option value='" + GameCreator.helpers.toString(collection[key]) + "'" + (collection[key] + '' === selectedValue + '' ? " selected" : "") + ">" + key + "</option>";
            }
        };
        result += "</select>";
        return result;
    },

    numberInput: function(attrName, value) {
        return '<input type="text" class="numberField" data-type="number" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },

    globalObjectInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector(GameCreator.helpers.getGlobalObjectIds(), attrName, value);
    },
    sceneObjectInput: function(attrName, value) {
        var ids = GameCreator.getUniqueIDsInActiveScene();
        ids['this'] = 'this';
        return GameCreator.htmlStrings.singleSelector(ids, attrName, value);
    },

    counterCarrierInput: function(attrName, value) {
        var ids = GameCreator.getUniqueIDsWithCountersInActiveScene();
        return GameCreator.htmlStrings.singleSelector(ids, attrName, value);
    },

    shootableObjectInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector(GameCreator.helpers.getShootableObjectIds(), attrName, value);
    },

    destroyEffectInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector(GameCreator.effects.destroyEffects, attrName, value);
    },

    stateInput: function(attrName, value, globalObj) {
        var selectableStates = {};
        globalObj.states.forEach(function(state){
            selectableStates[state.name] = state.id;
        });
        return GameCreator.htmlStrings.singleSelector(selectableStates, attrName, value);
    },

    comparatorInput: function(attrName, value) {
        var selectableComparators = { 'Equals': 'equals', 'Greater than': 'greaterThan', 'Less than': 'lessThan'};
        return GameCreator.htmlStrings.singleSelector(selectableComparators, attrName, value);
    },

    counterInput: function(attrName, value, globalObj) {
        var counters = {};
        var counterNames = Object.keys(globalObj.parentCounters);
        for (var i = 0; i < counterNames.length; i += 1) {
            counters[counterNames[i]] = counterNames[i];
        }
        return GameCreator.htmlStrings.singleSelector(counters, attrName, value)
    },

    sceneObjectCounterInput: function(attrName, value, globalObj, dependancy) {
        var counterNames, counters = {};
        var sceneObject = GameCreator.getSceneObjectById(dependancy);
        if (sceneObject) {
            if(sceneObject.parent.attributes && sceneObject.parent.attributes.unique) {
                counterNames = Object.keys(sceneObject.parent.counters);
            } else {
                counterNames = Object.keys(sceneObject.counters);
            }
            for (var i = 0; i < counterNames.length; i += 1) {
                counters[counterNames[i]] = counterNames[i];
            }
        }
        return GameCreator.htmlStrings.singleSelector(counters, attrName, value);
    },

    counterTypeInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector({'Add': 'add', 'Reduce': 'reduce', 'Set to': 'set'}, attrName, value);
    },

    movementTypeInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector({'Move': 'move', 'Set position': 'setPosition'}, attrName, value);
    },

    sceneInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector(GameCreator.helpers.getSelectableScenes(), attrName, value);
    },

    stringInput: function(attrName, value) {
        return '<input type="text" class="textField" data-type="string" data-attrName="' + attrName + '" value="' + (value === undefined ? '' : value) + '"/>'
    },

    directionInput: function(attrName, value) {
        return GameCreator.htmlStrings.singleSelector(GameCreator.directions, attrName, value);
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

    checkboxInput: function(attrName, checked) {
        return '<input type="checkbox" class="checkboxField" data-type="checkbox" data-attrName="' +
            attrName + '" ' + (checked ? 'checked' : '') + ' />'
    },

    imageInput: function(attrName, value) {
        return '<input type="text" class="textField" data-type="image" data-attrName="' + attrName + '" value="' + (value ? value.src : '') + '"/>'
    },

    inputLabel: function(labelText) {
        return '<label>' + labelText + '</label>';
    },

    parameterGroup: function(parameterInput) {
        return '<div class="actionParameter">' + parameterInput + '</div>'
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

    defaultMenuElement: function(text) {
        return '<li class="defaultMenuElement headingNormalBlack" data-name="' + text + '"><span>' + text + '</span></li>';
    },

    stateMenuElement: function(id, name) {
        return '<li class="defaultMenuElement headingNormalBlack" data-id="' + id + '"><span>' + name + '</span></li>';
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
        var result = '<div class="routeNodeContainer" style="position:absolute; top:' + (node.y + $("#main-canvas").offset().top) + 'px;left:' + (node.x + $("#main-canvas").offset().left) + 'px;"><div class="routeNode" data-index="' + index + '"> \
            <span class="routeNodeLabel">' + (index + 1) + '</span></div> \
            <div class="routeNodeActions"><a class="add-node-button" data-index="' + index + '">+</a>';
        if (index != 0) {    
            result += '<div class="remove-node-button" data-index="' + index + '">X</div>';
        }
        if(node.bounceNode) {
            result += '<div class="toggle-bounce-node-button" data-index="' + index + '">Turn</div>';
        } else {
            result += '<div class="toggle-bounce-node-button" data-index="' + index + '">Continue</div>';
        }
        return result + '</div></div>';
    },

    defaultEventInformationWindow: function(title, imageSrc) {
        var html = '<div id="event-information-window">';
        html += '<div class="panel-heading"> \
                 <span class="panel-title">' + title + '</span> \
                 </div>';

        html += '<div class="panel-body"> \
                 <div class="image-preview image-preview-large"> \
                 <img src="' + imageSrc + '" /> \
                 </div> \
                 </div> \
                 </div>';
                 
        return html;
        
    },

    sceneStartedEventInformationWindow: function(title) {
        var html = '<div id="event-information-window">';
        html += '<div>' + title + '</div>';
        html += '</div>';
        return html;
    },

    collisionEventInformationWindow: function(title, image1Src, image2Src) {
        var html = '<div id="event-information-window">';
        html += '<div class="panel-heading"> \
                 <span class="panel-title">' + title + '</span> \
                 </div>';

        html += '<div class="panel-body"> \
                 <div class="image-preview"> \
                 <img src="' + image1Src + '" /> \
                 </div> \
                 <div class="image-preview"> \
                 <img src="' + image2Src + '" /> \
                 </div> \
                 </div> \
                 </div>';
                 
        return html;
    },

    editActionsWindow: function(infoWindowHtml, objName) {
        var html = '<div class="dialogue right"><div id="select-action-window" class="panel panel-dialogue">';
        html += '<div class="panel-heading "> \
                 <span class="panel-title">Set Action Manager: ' + objName + '</span> \
                 </div>';
        html += infoWindowHtml;
        html += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        html += GameCreator.htmlStrings.getColumn('Select Item', 'dialogue-panel-add-list');
        html += '</div></div>'
        return html;
    },

    addGlobalObjectWindow: function() {
        var html = '<div class="dialogue bottom"><div id="add-global-object-window" class="panel-default" style="height: 570px">';
        html += GameCreator.htmlStrings.getColumn('Type of object', 'dialogue-panel-object-type-group');
        html += GameCreator.htmlStrings.getColumn('Object', 'dialogue-panel-object-type');
        html += '<div class="col" id="add-global-object-form-content"></div>'
        html += '</div></div>'
        return html;
    },
    
    collisionObjectSelector: function(object) {
        var result = '';
        var selectableObjects = {};
        var objName, objId;
        $.extend(selectableObjects, GameCreator.globalObjects, GameCreator.borderObjects);
        for (objName in selectableObjects) {
            objId = GameCreator.helpers.findGlobalObjectByName(objName).id;
            if (selectableObjects.hasOwnProperty(objName) && 
                !GameCreator.helpers.getObjectById(object.onCollideSets, objId) && 
                selectableObjects[objName].isCollidable) {
                result += '<li data-objectname="' + objName + '">' + GameCreator.htmlStrings.selectGlobalObjectPresentation(objId) + '</li>';
            }
        }
    	return result;
	},

    selectGlobalObjectPresentation: function(globalObjectId) {
        var globalObject = GameCreator.helpers.findGlobalObjectById(globalObjectId);
        return '<img width="25" height="25" src="' + globalObject.getDefaultState().attributes.image.src + '"/><span>' + globalObject.objectName + '</span>'
    },

    createNameSelectionForm: function(placeholder, id, saveCallback) {
        var result = document.createElement('div');
        $(result).attr('id', id);

        var nameInput = document.createElement('input');
        $(nameInput).attr('type', 'text');
        $(nameInput).addClass('textField');
        $(nameInput).attr('placeholder', placeholder);
        $(result).append(nameInput);

        var saveButton = document.createElement('button');
        $(saveButton).click(saveCallback);
        $(saveButton).html('Save');
        $(result).append(saveButton);

        var cancelButton = document.createElement('button');
        $(cancelButton).click(function() {
            $(this).parent().remove();
        });
        $(cancelButton).html('Cancel');
        $(result).append(cancelButton);

        return result;
    },
	
	getCounterEventForm: function(formId) {
		var result = '<div id="' + formId + '">' + GameCreator.htmlStrings.inputLabel("Type:");
		result += GameCreator.htmlStrings.singleSelector({atValue: "atValue", aboveValue: "aboveValue", belowValue: "belowValue"});
		result += GameCreator.htmlStrings.inputLabel("Value:");
    	result += GameCreator.htmlStrings.numberInput("value");
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
        return '<li class="tab ' + (sceneActive ? 'active' : '')  + '" data-sceneid="' + scene.id + '" draggable="true">' + scene.attributes.name + '</li>';
	},

	addSceneTab: function() {
        return '<li id="add-scene-tab">+</li>';
	},

    imageUploadControls: function() {
        return ' \
        <div> \
            <button class="btn btn-normal btn-success upload-image-button">Upload Image</button> \
            <button class="btn btn-normal btn-warning clear-image-input-button">Remove Image</button> \
            <input class="visuallyhidden hidden-file-input" type="file" accept="image/*"> \
        </div>'
    },

    getColumn: function(title, id) {
        var result = "";
        var i;

        result += '<div class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">' + title + '</span> \
                   </div> \
                   <ul id="' + id + '" class="nav nav-stacked nav-tabs nav-tabs-success"> \
                   </ul> \
                   </div>';
                   
        return result;
    },

    getScenePropertiesForm: function() {

        var result = ' \
        <ul class="nav nav-stacked nav-tabs nav-tabs-success form-container"> \
            <li class="condition-parameters"> \
                <span class="icon-down-dir">Scene</span> \
                <table> \
                    <tbody> \
                        <tr> \
                            <td>Name:</td> \
                            <td id="side-property-name" data-inputtype="stringInput"></td> \
                        </tr> \
                        <tr> \
                            <td>Background Color:</td> \
                            <td id="side-property-bgColor" data-inputtype="stringInput"></td> \
                        </tr> \
                        <tr> \
                            <td>Background Image:</td> \
                            <td id="side-property-bgImage" data-inputtype="imageInput"></td> \
                        </tr> \
                    </tbody> \
                </table> \
            </li> \
        </ul> \
        <div class="panel-paragraph properties-group"> \
            <button class="btn btn-success btn-wide" id="setup-scene-actions">Scene Started Actions</button> \
        </div>'

        return result;
    },
    sceneObjectDeleteButton: function() {
        return '<div class="panel-paragraph properties-group"> \
            <button class="btn btn-warning" id="delete-sceneobject-button">Delete</button> \
        </div>'
    }

};