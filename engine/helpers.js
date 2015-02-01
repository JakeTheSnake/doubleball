/*global GameCreator*/
(function() {
    "use strict";
    GameCreator.helpers.determineQuadrant = function(base, obj) {
        var x = obj.attributes.x;
        var y = obj.attributes.y;
        var width = obj.attributes.width;
        var height = obj.attributes.height;
        var baseWidth = base.attributes.width;
        var baseHeight = base.attributes.height;
        var objMidX = x + width / 2;
        var objMidY = y + height / 2;
        var baseMidX = base.attributes.x + base.attributes.width / 2;
        var baseMidY = base.attributes.y + base.attributes.height / 2;
        var baseEdgeTLX = base.attributes.x;
        var baseEdgeTLY = base.attributes.y;

        var baseEdgeTRX = base.attributes.x + baseWidth;
        var baseEdgeTRY = base.attributes.y;

        var baseEdgeBLX = base.attributes.x + baseHeight;
        var baseEdgeBLY = base.attributes.y;

        var baseEdgeBRX = base.attributes.x + baseWidth;
        var baseEdgeBRY = base.attributes.y + baseHeight;
        //Top left quadrant
        if (objMidX - baseMidX <= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTLX > objMidY - baseEdgeTLY) {
                return 1;
            }
            return 4;
        }
        //Top right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTRX < baseEdgeTRY - objMidY) {
                return 1;
            }
            return 2;
        }
        //Bottom right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY >= 0) {
            if (objMidX - baseEdgeBRX < objMidY - baseEdgeBRY) {
                return 3;
            }
            return 2;
        }
        //Bottom left quadrant
        else if (objMidX - baseMidX <= 0 && objMidY - baseMidY >= 0) {
            if (baseEdgeBLX - objMidX < objMidY - baseEdgeBLY) {
                return 3;
            }
            return 4;
        }
    };

    GameCreator.helpers.doCollision = function(object, targetObject) {
        var event = GameCreator.helpers.getObjectById(object.parent.onCollideSets, targetObject.parent.id);
        var caSets = event ? event.caSets : undefined;
        var j, choosableActions, newSetsItem, currentSet;
        targetObject.invalidated = true;
        if (caSets !== undefined) {
            for (j = 0; j < caSets.length; j += 1) {
                currentSet = caSets[j];
                if (currentSet.checkConditions(object)) {
                    currentSet.runActions(object, {collisionObject: targetObject});
                    object.collidingWith.push(targetObject.attributes.instanceId);
                }
            }
        }
        else if (GameCreator.state !== 'playing') {
            choosableActions = GameCreator.helpers.getCollisionActions(object.parent.objectType);
            newSetsItem = {id: targetObject.parent.id, caSets: [new GameCreator.ConditionActionSet(object.parent)]};
            object.parent.onCollideSets.push(newSetsItem);
            var titleString = "'" + object.parent.objectName + "' collided with '" + targetObject.objectName + "'";
            GameCreator.UI.openEditActionsWindow(
                GameCreator.htmlStrings.collisionEventInformationWindow(titleString, object.attributes.image.src, targetObject.attributes.image.src),
                new GameCreator.CASetVM(newSetsItem.caSets[0], GameCreator.helpers.getCollisionActions(object.parent.objectType), object.parent), object.parent.objectName
            );
        }
    };

    GameCreator.helpers.updateObjectCollisionArrays = function(object, instanceId) {
        var objectBeneathIndex = object.objectsBeneath.indexOf(instanceId);
        var objectAboveIndex = object.objectsAbove.indexOf(instanceId);
        var objectLeftIndex = object.objectsLeft.indexOf(instanceId);
        var objectRightIndex = object.objectsRight.indexOf(instanceId);
        if (objectBeneathIndex !== -1) {
            object.objectsBeneath.splice(objectBeneathIndex, 1);
        }
        if (objectAboveIndex !== -1) {
            object.objectsAbove.splice(objectAboveIndex, 1);
        }
        if (objectLeftIndex !== -1) {
            object.objectsLeft.splice(objectLeftIndex, 1);
        }
        if (objectRightIndex !== -1) {
            object.objectsRight.splice(objectRightIndex, 1);
        }
    };

    GameCreator.helpers.checkCollisions = function(object) {

        //Check for border collisions.
        var x = object.attributes.x;
        var y = object.attributes.y;
        var width = object.attributes.width;
        var height = object.attributes.height;
        var i, j, runtimeObjectsItem, targetObject, collisionItem, colliding;

        var borderObjects = Object.keys(GameCreator.borderObjects);

        for (i = 0; i < borderObjects.length; i++) {
            var borderObject = GameCreator.borderObjects[borderObjects[i]];
            if (borderObject.collidesWith(object) && !object.alreadyCollidesWith(borderObject.objectName)) {
                GameCreator.helpers.doCollision(object, borderObject);
            } else if (!borderObject.collidesWith(object)) {
                object.removeFromCollidingList(borderObject.objectName);
            }
        }

        //Check for collisions with other objects.
        if (GameCreator.state === 'directing') {
            for (j = 0; j < GameCreator.collidableObjects.length; j += 1) {
                runtimeObjectsItem = GameCreator.collidableObjects[j];
                for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                    targetObject = runtimeObjectsItem.runtimeObjects[i];
                    colliding = GameCreator.helpers.checkObjectCollision(object, targetObject);
                    if (colliding && !object.alreadyCollidesWith(targetObject.attributes.instanceId)) {
                        GameCreator.helpers.doCollision(object, targetObject);
                    } else if (!colliding) {
                        object.removeFromCollidingList(targetObject.attributes.instanceId);
                    }
                }
            }
        } else {
            for (j = 0; j < object.parent.onCollideSets.length; j += 1) {
                collisionItem = object.parent.onCollideSets[j];
                runtimeObjectsItem = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, collisionItem.id);
                if (GameCreator.helpers.caSetsHaveActions(collisionItem) && runtimeObjectsItem) {
                    for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                        targetObject = runtimeObjectsItem.runtimeObjects[i];
                        colliding = GameCreator.helpers.checkObjectCollision(object, targetObject);
                        if (colliding && !object.alreadyCollidesWith(targetObject.attributes.instanceId)) {
                            GameCreator.helpers.doCollision(object, targetObject);
                        } else if (!colliding) {
                            object.removeFromCollidingList(targetObject.attributes.instanceId);
                        }
                    }
                }
            }
        }
    };

    /**
    * This function check if any Condition-Action-Set in this event contains actions.
    * If it does, we don't have to check for any collisions.
    */
    GameCreator.helpers.caSetsHaveActions = function(eventItem) {
        var i;
        for (i = 0; i < eventItem.caSets.length; i += 1) {
            if (eventItem.caSets[i].actions.length > 0) {
                return true;
            }
        }
        return false;
    }

    GameCreator.helpers.checkObjectCollision = function(object, targetObject) {
        if (!(object === targetObject)) {
            if ((Math.abs((object.attributes.x + object.attributes.width / 2) - (targetObject.attributes.x + targetObject.attributes.width / 2)) < object.attributes.width / 2 + targetObject.attributes.width / 2) &&
                    (Math.abs((object.attributes.y + object.attributes.height / 2) - (targetObject.attributes.y + targetObject.attributes.height / 2)) < object.attributes.height / 2 + targetObject.attributes.height / 2)) {
                return true;
            }
        }
        return false;
    };

    GameCreator.helpers.calcAngularSpeed = function(maxSpeed) {
        return Math.pow(Math.pow(maxSpeed, 2) / 2, 0.5);
    };

    GameCreator.helpers.toString = function(thing) {
        if (typeof (thing) === "object") {
            if (thing.objectName) {
                return thing.objectName;
            } else if (thing.name) {
                return thing.name;
            }
        }
        return String(thing);
    };

    GameCreator.helpers.parseBool = function(string) {
        return string === 'true' ? true : false;
    };

    GameCreator.helpers.parseRange = function(string) {
        var i, range;
        if (string.indexOf(':') > -1) {
            if (!(/^\-?\d+:\-?\d+$/.test(string)) ) {
                throw '"' + string + '" is not a valid range. Should be "&lt;num&gt;"" or "&lt;num&gt;:&lt;num&gt;"';
            } 
            range = string.split(":", 2);
            for (i = 0; i < range.length; i += 1) {
                range[i] = GameCreator.helpers.parseNumber(range[i]);
            }    
        } else {
            range = [];
            range.push(GameCreator.helpers.parseNumber(string));
        }
        
        return range;
    };

    GameCreator.helpers.calcUnitVector = function(x, y) {
        var magnitude = Math.sqrt((x * x) + (y * y));
        if (magnitude === 0) {
            return {x: 0, y: 0};
        }
        return {x: x / magnitude, y: y / magnitude};
    };

    GameCreator.helpers.findGlobalObjectByName = function(name) {
        var object = GameCreator.globalObjects[name];
        if (!object) {
            object = GameCreator.borderObjects[name];
        }
        return object;
    };

    GameCreator.helpers.findGlobalObjectById = function(id) {
        var objects = Object.keys(GameCreator.globalObjects);
        var i;
        for (i = 0; i < objects.length; i += 1) {
            if (GameCreator.globalObjects[objects[i]].id === id) {
                return GameCreator.globalObjects[objects[i]];
            }
        }
        objects = Object.keys(GameCreator.borderObjects);
        for (i = 0; i < objects.length; i += 1) {
            if (GameCreator.borderObjects[objects[i]].id === id) {
                return GameCreator.borderObjects[objects[i]];
            }
        }
    };

    GameCreator.helpers.getValue = function(input) {
        var i, range, value;
        if (input.attr("data-type") === "string") {
            return input.val() ? input.val().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        } else if (input.attr("data-type") === "number") {
            return GameCreator.helpers.parseNumber(input.val());           
        } else if (input.attr("data-type") === "image") {
            return GameCreator.helpers.parseImage(input.val());
        } else if (input.attr("data-type") === "bool") {
            return GameCreator.helpers.parseBool(input.val());
        } else if (input.attr("data-type") === "range") {
            return GameCreator.helpers.parseRange(input.val());
        } else if (input.attr("data-type") === "checkbox") {
            return input.is(":checked");
        } else {
            return input.val() ? input.val().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        }
    };

    GameCreator.helpers.parseNumber = function(value) {
        if (!(/^\-?\d+$/.test(value))) {
            throw "'" + value + "' is not a number";
        }
        return parseInt(value);
    };

    GameCreator.helpers.parseImage = function(imgSrc) {
        var image = new Image();
        //TODO: Disabled this check. Need to allow empty image i think. Show some kind of "?" image as default then.
        //if (!(/(jpg|png|gif)$/.test(imgSrc))) throw '"' + imgSrc + '" is not a valid image URL';
        image.src = imgSrc;
        image.onload = function() {
            $(image).data('loaded', true);
            GameCreator.render();
        };
        return image;
    };

    GameCreator.helpers.getRandomFromRange = function(range) {
        var value;
        if (Array.isArray(range)) {
            if (range.length === 2) {
                var max = parseInt(range[1], 10);
                var min = parseInt(range[0], 10);
                value = Math.floor((Math.random() * (max - min)) + min);
            } else {
                value = parseInt(range[0], 10);
            }
        } else {
            value = parseInt(range, 10);
        }
        return value || 0;
    };

    GameCreator.helpers.getObjectById = function(array, id) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                return array[i];
            }
        }
    };

    GameCreator.helpers.removeObjectFromArrayByInstanceId = function(array, id) {
        var found = false;
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].attributes.instanceId === id) {
                found = true;
                break;
            }
        }
        if (found) {
            array.splice(i, 1);
        }
    };

    GameCreator.helpers.removeObjectFromArrayById = function(array, id) {
        var found = false;
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                found = true;
                break;
            }
        }
        if (found) {
            array.splice(i, 1);
        }
    };

    GameCreator.helpers.setStandardProperties = function(globalObj, args) {
        args = args ? args : {};
        globalObj.objectName = args.objectName;
        globalObj.attributes = {
            unique: args.unique != undefined ? args.unique : false
        };
        globalObj.parentCounters = {};
        globalObj.counters = {};
        globalObj.onDestroySets = [];
        globalObj.onCreateSets = [];
        globalObj.states = [{
            name: "Default",
            id: 0,
            attributes: {
                image: args.image != undefined ? args.image : '',
                width: args.width != undefined ? args.width : [50],
                height: args.height != undefined ? args.height : [50],
            }
        }];
    };

    GameCreator.helpers.getStandardAttributes = function() {
        return {"image": GameCreator.htmlStrings.imageInput,
          "width": GameCreator.htmlStrings.rangeInput,
          "height": GameCreator.htmlStrings.rangeInput};
    };

    GameCreator.helpers.getStandardNonStateAttributes = function() {
        return {"unique": GameCreator.htmlStrings.checkboxInput};
    };

    GameCreator.helpers.getNonCollisionActions = function(objectType) {
        if (objectType === "MouseObject") {
            return GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            return GameCreator.actionGroups.nonCollisionActions;
        }
    };

    GameCreator.helpers.getCollisionActions = function(objectType) {
        if (objectType === "MouseObject") {
            return GameCreator.actionGroups.mouseCollisionActions;
        } else {
            return GameCreator.actionGroups.collisionActions;
        }
    };

    GameCreator.helpers.labelize = function(name) {
        var segments = name.match(/([A-Z]?[a-z]*)/g);
        for (var i = 0; i < segments.length; i++) {
            segments[i] = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
        }
        return segments.join(" ");
    };

    GameCreator.helpers.populateImageUploadControls = function() {
        $('#global-object-image-upload-controls').html(GameCreator.htmlStrings.imageUploadControls());

        $('#global-object-image-upload-controls .upload-image-button').click(function() {
            $('#global-object-image-upload-controls .hidden-file-input').trigger('click');
        });

        $('#global-object-image-upload-controls .hidden-file-input').on('change', function(evt){
            var file = evt.target.files[0];
            var reader = new FileReader();

            if(file.size > 500000) alert('File too large.');

            reader.onload = function() {
                $('#object-property-image-container input').val(reader.result);
                $('#object-property-image-container input').trigger('blur');
            }

            reader.readAsDataURL(file);
        });

        $('#global-object-image-upload-controls .clear-image-input-button').click(function(){
            $('#object-property-image-container input').val('');
            $('#object-property-image-container input').trigger('blur');
        });
    };

    GameCreator.helpers.populateGlobalObjectPropertiesForm = function(attributes, attrToInputMap, containerId, globalObj) {
        var i, keys = attributes ? Object.keys(attributes) : [];

        for (i = 0; i < keys.length; i += 1) {
            var attributeName = keys[i];
            if (attrToInputMap[attributeName]) {
                $("#object-property-" + attributeName + "-container").html(
                    attrToInputMap[attributeName](attributeName, attributes[attributeName]) + 
                    GameCreator.htmlStrings.inputLabel(GameCreator.helpers.labelize(attributeName))
                );
            }
        }
        $('#' + containerId + ' input').on('change', function() {
            try {
                GameCreator.saveInputValueToObject($(this), attributes);
                //If unique is set, need to reset counters.
                if ($(this).data('attrname') === 'unique') {
                    GameCreator.getActiveScene().objects.forEach(function(sceneObj){
                        if(sceneObj.parent === globalObj) {
                            GameCreator.resetCounters(sceneObj, sceneObj.parent.parentCounters);
                        }
                    });
                }
            } catch (err) {}
        });
        $('#' + containerId + ' input').blur(function() {
            try {
                GameCreator.saveInputValueToObject($(this), attributes);
            } catch (err) {
                $(this).addClass('properties-validation-flash'); // ANIMATION
                var that = $(this);
                setTimeout(function() { that.removeClass('properties-validation-flash'); }, 700);
                GameCreator.UI.createValidationBox($(this), err);
            }
        });
    };

    GameCreator.helpers.populateSidePropertiesForm = function(sideObject, onChangeCallback) {
        var i;
        var attributes = sideObject.attributes;
        if (sideObject.parent) {
            $('#side-property-instanceOf').html(sideObject.parent.objectName);
        }
        //The instanceId should not be editable for now, so only display it.
        if (sideObject.attributes.instanceId) {
            $('#side-property-instanceId-title').html(sideObject.attributes.instanceId)
        }
        for (i = 0; i < Object.keys(attributes).length; i += 1) {
            var attributeName = Object.keys(attributes)[i];
            GameCreator.UI.setupValuePresenter($("#side-property-" + attributeName), attributes, attributeName, sideObject, onChangeCallback);
        }
    };

    GameCreator.helpers.startsWith = function(baseString, comparator) {
        return baseString.substring(0, comparator.length) === comparator;
    };



    GameCreator.helpers.setMouseCursor = function(dragFunc) {
        var cursor = "auto";
        switch (dragFunc) {
            case GameCreator.SceneObject.prototype.resizeNW:
            case GameCreator.SceneObject.prototype.resizeSE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaNW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaSE:
                cursor = "nw-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeNE:
            case GameCreator.SceneObject.prototype.resizeSW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaNE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaSW:
                cursor = "ne-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeW:
            case GameCreator.SceneObject.prototype.resizeE:
            case GameCreator.SceneObject.prototype.resizeMouseAreaW:
            case GameCreator.SceneObject.prototype.resizeMouseAreaE:
                cursor = "w-resize";
                break;
            case GameCreator.SceneObject.prototype.resizeN:
            case GameCreator.SceneObject.prototype.resizeS:
            case GameCreator.SceneObject.prototype.resizeMouseAreaN:
            case GameCreator.SceneObject.prototype.resizeMouseAreaS:
                cursor = "n-resize";
                break;
            case GameCreator.SceneObject.prototype.moveObject:
                cursor = "move";
                break;
            default:
                cursor = "auto";
                break;
        }
        $(GameCreator.mainCanvas).css("cursor", cursor);
    };

    GameCreator.helpers.getPresentationForInputValue = function(value, type, obj) {
        var scene;
        if (value !== undefined && value !== null && value !== '') {
            switch (type) {
                case "rangeInput":
                    if (value.length == 1) {
                        return value[0];
                    } else if (value.length == 2) {
                        return (value[0] + " to " + value[1]);
                    } else {
                        return value;
                    }
                case "globalObjectInput":
                case "shootableObjectInput":
                    return GameCreator.helpers.findGlobalObjectById(Number(value)).objectName;
                case "stateInput":
                    return GameCreator.helpers.getObjectById(obj.states, Number(value)).name;
                case "counterTypeInput":
                    return GameCreator.helpers.getPrettyName(value);
                case "sceneInput":
                    scene = GameCreator.getSceneById(Number(value));
                    return scene ? scene.attributes.name : '*Scene removed*';
                case "imageInput":
                    return '<img src="' + value.src + '" width="40" height="40"/>';
                default:
                    return value;
            }
        }
        return '&lt;Edit&gt;';
    };

    GameCreator.helpers.getPrettyName = function(databaseName) {
        var prettyNames = {
            objectToCreate: 'Object',
            objectToShoot: 'Object',
            projectileSpeed: 'Speed',
            projectileDirection: 'Direction',
            objectState: 'State',
            objId: 'Object',
            counterDisplay: 'Counter',
            change: 'Add',
            set: 'Set to'
        }
        return prettyNames[databaseName] ? prettyNames[databaseName] : databaseName.charAt(0).toUpperCase() + databaseName.slice(1);
    };

    GameCreator.helpers.getShootableObjectIds = function(){
        var i, result = {};
        var objectNames = Object.keys(GameCreator.globalObjects);
        for(i = 0; i < objectNames.length; i += 1) {
            if(GameCreator.globalObjects[objectNames[i]].isShootable()) {
                result[objectNames[i]] = GameCreator.globalObjects[objectNames[i]].id;
            }
        }
        return result;
    };

    GameCreator.helpers.getSelectableScenes = function() {
        var result = {};
        GameCreator.scenes.forEach(function(scene){
            result[scene.attributes.name] = scene.id;
        });
        return result;
    };

    GameCreator.helpers.getGlobalObjectIds = function() {
        var i, result = {};
        var objectNames = Object.keys(GameCreator.globalObjects);
        for(i = 0; i < objectNames.length; i += 1) {
            result[objectNames[i]] = GameCreator.globalObjects[objectNames[i]].id;
        }
        return result;
    };

    GameCreator.helpers.getSelectableTimings = function(actionName) {
        var timings = GameCreator.actions[actionName].timing;
        var selectableTimings = {'Now': 'now'};
        var timingKeys = Object.keys(timings);
        for (var i = 0; i < timingKeys.length; i+=1) {
            if (timings[timingKeys[i]]) {
                selectableTimings[GameCreator.helpers.getPrettyName(timingKeys[i])] = timingKeys[i];
            }
        }
        return selectableTimings;
    };

    GameCreator.helpers.getIndexOfObjectWithId = function(targetId) {
        var i;
        for (i = 0; i < GameCreator.scenes.length; i++) {
            if (GameCreator.scenes[i].id === targetId) return i;
        }
    };

    GameCreator.helpers.getValidXCoordinate = function(x) {
        var offsetLeft = $("#main-canvas").offset().left;

        if (x < offsetLeft) x = offsetLeft;
        if (x > offsetLeft + GameCreator.width) x = offsetLeft + GameCreator.width;
        return x;
    }

    GameCreator.helpers.getValidYCoordinate = function(y) {
        var offsetTop = $("#main-canvas").offset().top;

        if (y < offsetTop) y = offsetTop;
        if (y > offsetTop + GameCreator.height) y = offsetTop + GameCreator.height;
        return y;
    }

    Array.prototype.collect = function(collectFunc) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            var collectedValue = collectFunc(this[i]);
            if (collectedValue !== undefined) {
                result.push(collectedValue);
            }
        }
        return result;
    };
}());