/*global GameCreator*/
(function() {
    "use strict";
    GameCreator.helpers.determineQuadrant = function(base, obj) {
        var x = obj.x;
        var y = obj.y;
        var width = obj.width;
        var height = obj.height;
        var baseWidth = base.width;
        var baseHeight = base.height;
        var objMidX = x + width / 2;
        var objMidY = y + height / 2;
        var baseMidX = base.x + base.width / 2;
        var baseMidY = base.y + base.height / 2;
        var baseEdgeTL = {x: base.x, y: base.y};
        var baseEdgeTR = {x: base.x + baseWidth, y: base.y};
        var baseEdgeBL = {x: base.x + baseHeight, y: base.y};
        var baseEdgeBR = {x: base.x + baseWidth, y: base.y + baseHeight};
        //Top left quadrant
        if (objMidX - baseMidX <= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTL.x > objMidY - baseEdgeTL.y) {
                return 1;
            }
            return 4;
        }
        //Top right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY <= 0) {
            if (objMidX - baseEdgeTR.x < baseEdgeTR.y - objMidY) {
                return 1;
            }
            return 2;
        }
        //Bottom right quadrant
        else if (objMidX - baseMidX >= 0 && objMidY - baseMidY >= 0) {
            if (objMidX - baseEdgeBR.x < objMidY - baseEdgeBR.y) {
                return 3;
            }
            return 2;
        }
        //Bottom left quadrant
        else if (objMidX - baseMidX <= 0 && objMidY - baseMidY >= 0) {
            if (baseEdgeBL.x - objMidX < objMidY - baseEdgeBL.y) {
                return 3;
            }
            return 4;
        }
    };

    GameCreator.helpers.doCollision = function(object, targetObject) {
        var currentEventItem = GameCreator.helpers.getObjectById(object.parent.onCollideEvents, targetObject.parent.id);
        var j, choosableActions, newEventItem, currentEvent;
        targetObject.invalidated = true;
        if (currentEventItem !== undefined) {
            for (j = 0; j < currentEventItem.events.length; j += 1) {
                currentEvent = currentEventItem.events[j];
                if (currentEvent.checkConditions()) {
                    currentEvent.runActions(object, {collisionObject: targetObject});
                }
            }
        }
        else if (GameCreator.state !== 'playing') {
            if (object.parent.objectType === "MouseObject") {
                choosableActions = GameCreator.actionGroups.mouseCollisionActions;
            } else {
                choosableActions = GameCreator.actionGroups.collisionActions;
            }
            newEventItem = {id: targetObject.parent.id, events: [new GameCreator.Event()]};
            object.parent.onCollideEvents.push(newEventItem);
            GameCreator.UI.openEditActionsWindow(
                "'" + object.parent.objectName + "' collided with '" + targetObject.objectName + "'",
                choosableActions,
                newEventItem.events[0].actions,
                object.objectName
            );
        }
    };

    GameCreator.helpers.checkCollisions = function(object) {
        if (object.objectBeneath !== undefined) {
            object.objectBeneath = false;
        }

        //Check for border collisions.
        var x = object.x;
        var y = object.y;
        var width = object.width;
        var height = object.height;
        var i, j, runtimeObjectsItem, collisionObject, targetObject, collisionItem;

        if (x < 1) {
            collisionObject = GameCreator.borderObjects.borderL;
            GameCreator.helpers.doCollision(object, collisionObject);
        }
        if (x + width > GameCreator.width - 1) {
            collisionObject = GameCreator.borderObjects.borderR;
            GameCreator.helpers.doCollision(object, collisionObject);
        }
        if (y < 1) {
            collisionObject = GameCreator.borderObjects.borderT;
            GameCreator.helpers.doCollision(object, collisionObject);
        }
        if (y + height > GameCreator.height - 1) {
            collisionObject = GameCreator.borderObjects.borderB;
            GameCreator.helpers.doCollision(object, collisionObject);
        }

        if (GameCreator.state === 'directing') {
            for (j = 0; j < GameCreator.collidableObjects.length; j += 1) {
                runtimeObjectsItem = GameCreator.collidableObjects[j];
                for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                    targetObject = runtimeObjectsItem.runtimeObjects[i];
                    if (GameCreator.helpers.checkObjectCollision(object, targetObject) && !GameCreator.paused) {
                        GameCreator.helpers.doCollision(object, targetObject);
                    }
                }
            }
        } else {
            for (j = 0; j < object.parent.onCollideEvents.length; j += 1) {
                collisionItem = object.parent.onCollideEvents[j];
                runtimeObjectsItem = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, collisionItem.id);
                if (GameCreator.helpers.eventItemHasActions(collisionItem) && runtimeObjectsItem) {
                    for (i = 0; i < runtimeObjectsItem.runtimeObjects.length; i += 1) {
                        targetObject = runtimeObjectsItem.runtimeObjects[i];
                        if (GameCreator.helpers.checkObjectCollision(object, targetObject) && !GameCreator.paused) {
                            GameCreator.helpers.doCollision(object, targetObject);
                        }
                    }
                }
            }
        }
    };

    GameCreator.helpers.eventItemHasActions = function(eventItem) {
        var i;
        for (i = 0; i < eventItem.events.length; i += 1) {
            if (eventItem.events[i].actions.length > 0) {
                return true;
            }
        }
        return false;
    }

    GameCreator.helpers.checkObjectCollision = function(object, targetObject) {
        if (!(object === targetObject)) {
            if ((Math.abs((object.x + object.width / 2) - (targetObject.x + targetObject.width / 2)) < object.width / 2 + targetObject.width / 2) &&
                    (Math.abs((object.y + object.height / 2) - (targetObject.y + targetObject.height / 2)) < object.height / 2 + targetObject.height / 2)) {
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
        return string.split(":", 2);
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
        var i, range;
        if (input.attr("data-type") === "string" && input.val().length !== 0) {
            return input.val();
        } else if (input.attr("data-type") === "number" && input.val().length !== 0) {
            return parseFloat(input.val());
        } else if (input.attr("data-type") === "image" && input.val().length !== 0) {
            return GameCreator.helpers.parseImage(input.val());
        } else if (input.attr("data-type") === "bool" && input.val().length !== 0) {
            return GameCreator.helpers.parseBool(input.val());
        } else if (input.attr("data-type") === "range" && input.val().length !== 0) {
            range = GameCreator.helpers.parseRange(input.val());
            for (i = 0; i < range.length; i += 1) {
                range[i] = parseFloat(range[i]);
            }
            return range;
        } else if (input.attr("data-type") === "checkbox" && input.val().length !== 0) {
            return input.is(":checked");
        } else {
            return input.val();
        }
    };

    GameCreator.helpers.parseImage = function(imgSrc) {
        var image = new Image();
        image.src = imgSrc;
        image.onload = function() {
                $(image).data('loaded', true);
                GameCreator.render();
            };
        return image;
    }

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
        return value;
    };

    GameCreator.helpers.calculateScene = function(activeScene, params) {
        switch (params.changeType) {
        case 'increment':
            return activeScene + params.changeValue;
        case 'decrement':
            return activeScene - params.changeValue;
        case 'setScene':
            return params.changeValue;
        }
    };

    GameCreator.helpers.getObjectById = function(array, id) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].id === id) {
                return array[i];
            }
        }
    };

    GameCreator.helpers.removeObjectFromArrayById = function(array, id) {
        var found = false;
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i].instanceId === id) {
                found = true;
                break;
            }
        }
        if (found) {
            array.splice(i, 1);
        }
    };

    GameCreator.helpers.setStandardProperties = function(globalObj, args) {
        globalObj.objectName = args.objectName;
        globalObj.unique = args.unique;
        globalObj.parentCounters = {};
        globalObj.counters = {};
        globalObj.onDestroyEvents = [];
        globalObj.onCreateEvents = [];
        globalObj.states = [{
            name: "Default",
            id: 0,
            attributes: {
                image: args.image,
                width: args.width,
                height: args.height
            }
        }];
    };

    GameCreator.helpers.getStandardAttributes = function() {
        return {"image": GameCreator.htmlStrings.imageInput,
          "width": GameCreator.htmlStrings.rangeInput,
          "height": GameCreator.htmlStrings.rangeInput};
    };

    GameCreator.helpers.getNonCollisionActions = function(objectType) {
        if (objectType === "MouseObject") {
            return GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            return GameCreator.actionGroups.nonCollisionActions;
        }
    };

    GameCreator.helpers.labelize = function(name) {
        var segments = name.match(/([A-Z]?[a-z]*)/g);
        for (var i = 0; i < segments.length; i++) {
            segments[i] = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
        }
        return segments.join(" ");
    };

    GameCreator.helpers.getAttributeForm = function(attributes, attrToInputMap, defaults) {
        var result = '';
        var attrNames = Object.keys(attributes);
        for (var i = 0; i < attrNames.length; i++) {
            if(attrToInputMap[attrNames[i]]) {
                var elementId = 'object-property-' + attrNames[i];
                var defaultValue;
                if (defaults) {
                    defaultValue = defaults[attrNames[i]];
                }

                result += '<div class="form-group">'

                result += GameCreator.htmlStrings.inputLabel(elementId, GameCreator.helpers.labelize(attrNames[i])) +
                          attrToInputMap[attrNames[i]](elementId, attrNames[i], defaultValue);

                result += '</div>';
            }
        }
        return result;
    };

    GameCreator.helpers.startsWith = function(baseString, comparator) {
        return baseString.substring(0, comparator.length) === comparator;
    };



    GameCreator.helpers.setMouseCursor = function(dragFunc) {
        var cursor = "auto";
        switch (dragFunc) {
            case GameCreator.SceneObject.prototype.resizeNW:
            case GameCreator.SceneObject.prototype.resizeSE:
                cursor = "nw-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeNE:
            case GameCreator.SceneObject.prototype.resizeSW:
                cursor = "ne-resize"
                break;
            case GameCreator.SceneObject.prototype.resizeW:
            case GameCreator.SceneObject.prototype.resizeE:
                cursor = "w-resize";
                break;
            case GameCreator.SceneObject.prototype.resizeN:
            case GameCreator.SceneObject.prototype.resizeS:
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
    }

    Array.prototype.collect = function(collectFunc) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result.push(collectFunc(this[i]));
        }
        return result;
    }

}());