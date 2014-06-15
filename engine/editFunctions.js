/*global GameCreator, $, Image, window*/
(function() {
    "use strict";
    $.extend(GameCreator, {

        directions: {
            Default: "Default",
            Up: "Up",
            Down: "Down",
            Left: "Left",
            Right: "Right"
        },

        addGlobalObject: function(args, objectType) {
            var globalObj = new GameCreator[objectType](args);
            GameCreator.globalIdCounter += 1;
            globalObj.id = GameCreator.globalIdCounter;
            GameCreator.UI.createLibraryItem(globalObj);
            GameCreator.globalObjects[globalObj.objectName] = globalObj;
            return globalObj;
        },

        directActiveScene: function() {
            GameCreator.directScene(GameCreator.scenes[GameCreator.activeScene]);
        },

        directScene: function(scene) {
            GameCreator.switchScene(scene);
            GameCreator.resetGlobalCounters();
            GameCreator.then = Date.now();
            GameCreator.UI.directSceneMode();
            GameCreator.state = 'directing';

            GameCreator.gameLoop();
        },

        drawSelectionLine: function() {
            GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
            if (GameCreator.selectedObject) {
                var selobj = GameCreator.selectedObject;
                GameCreator.uiContext.beginPath();
                GameCreator.uiContext.moveTo(selobj.x, selobj.y);
                GameCreator.uiContext.lineTo(selobj.x + selobj.displayWidth, selobj.y);
                GameCreator.uiContext.lineTo(selobj.x + selobj.displayWidth, selobj.y + selobj.displayHeight);
                GameCreator.uiContext.lineTo(selobj.x, selobj.y + selobj.displayHeight);
                GameCreator.uiContext.closePath();
                GameCreator.uiContext.stroke();
            }
        },

        stopEditing: function() {
            $(GameCreator.mainCanvas).off(".editScene");
            GameCreator.selectedObject = null;
            GameCreator.UI.unselectSceneObject();
        },

        editActiveScene: function() {
            this.editScene(GameCreator.scenes[GameCreator.activeScene]);
        },

        editScene: function(scene) {
            var i, obj, dragFunc, mouseLeft, mouseTop;
            GameCreator.reset();
            GameCreator.resetScene(scene);
            GameCreator.state = 'editing';
            //Here we populate the renderableObjects only since the other kinds are unused for editing. Also we use the actual sceneObjects in the
            //renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
            for (i = 0; i < scene.length; i += 1) {
                obj = scene[i];
                if (obj.parent.isRenderable) {
                    GameCreator.renderableObjects.push(obj);
                    GameCreator.render(true);
                }
            }
            $(window).on("mousemove", function(e) {
                if (GameCreator.draggedNode) {
                    $(GameCreator.draggedNode).parent().css("top", e.pageY - 10);
                    $(GameCreator.draggedNode).parent().css("left", e.pageX - 10);
                    return false;
                }
            });
            $(window).on("mouseup", function(e) {
                if (GameCreator.draggedNode) {
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - GameCreator.mainCanvasOffsetX - 10;
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - GameCreator.mainCanvasOffsetY - 10;
                    GameCreator.draggedNode = undefined;
                    GameCreator.drawRoute(GameCreator.selectedObject.route);
                    return false;
                }
            });
            $(GameCreator.mainCanvas).on("mousedown.editScene", function(e) {
                mouseLeft = e.pageX - $("#main-canvas").offset().left;
                mouseTop = e.pageY - $("#main-canvas").offset().top;
                GameCreator.hoveredObject = GameCreator.getClickedObjectEditing(mouseLeft, mouseTop);
                if (GameCreator.hoveredObject) {
                    dragFunc = GameCreator.hoveredObject.getDragFunction(mouseLeft, mouseTop);
                    GameCreator.selectedObject = GameCreator.hoveredObject;
                    GameCreator.UI.editSceneObject();
                } else {
                    dragFunc = null;
                    GameCreator.unselectSceneObject();
                    GameCreator.drawSelectionLine();
                }
                GameCreator.render(false);
            });
            $(GameCreator.mainCanvas).on("mouseup", function(e) {
                if (GameCreator.hoveredObject) {
                    GameCreator.hoveredObject.cleanupSize();
                    GameCreator.hoveredObject = undefined;
                }
                dragFunc = null;
                GameCreator.helpers.setMouseCursor(dragFunc);
            });
            $(GameCreator.mainCanvas).on("mousemove", function(e) {
                mouseLeft = e.pageX - $("#main-canvas").offset().left;
                mouseTop = e.pageY - $("#main-canvas").offset().top;

                if (GameCreator.selectedObject) {
                    var hoveredObject = GameCreator.getClickedObjectEditing(mouseLeft, mouseTop);
                    if (hoveredObject) {
                        GameCreator.helpers.setMouseCursor(hoveredObject.getDragFunction(mouseLeft, mouseTop));
                    } else {
                        GameCreator.helpers.setMouseCursor(null);
                    }
                    GameCreator.invalidate(GameCreator.selectedObject);
                    if (dragFunc) {
                        GameCreator.helpers.setMouseCursor(dragFunc);
                        dragFunc.call(GameCreator.selectedObject, mouseLeft, mouseTop);
                        GameCreator.drawSelectionLine();
                    }
                    GameCreator.render(true);
                }
            });

            GameCreator.UI.setupSceneTabs(GameCreator.scenes);
            GameCreator.render(false);
        },

        dereferenceCounters: function(counterCarrier) {
            var counterName;
            for (counterName in counterCarrier.counters) {
                if (counterCarrier.counters.hasOwnProperty(counterName)) {
                    counterCarrier.counters[counterName].parentCounter = counterName;
                    counterCarrier.counters[counterName].parentObject = counterCarrier.counters[counterName].parentObject.objectName;
                }
            }
        },

        referenceCounters: function(counterCarrier) {
            var counterName, oldCounter;
            for (counterName in counterCarrier.counters) {
                if (counterCarrier.counters.hasOwnProperty(counterName)) {
                    oldCounter = counterCarrier.counters[counterName];
                    //Set the reference to the parent object from the name currently saved in its place.
                    counterCarrier.counters[counterName] = GameCreator.sceneObjectCounter.New(GameCreator.globalObjects[oldCounter.parentObject], GameCreator.globalObjects[oldCounter.parentObject].counters[counterName]);
                    counterCarrier.counters[counterName].aboveValueStates = oldCounter.aboveValueStates;
                    counterCarrier.counters[counterName].belowValueStates = oldCounter.belowValueStates;
                    counterCarrier.counters[counterName].atValueStates = oldCounter.atValueStates;
                    counterCarrier.counters[counterName].value = oldCounter.value;
                }
            }
        },

        saveState: function() {
            var results = {globalObjects: {}, scenes: [], idCounter: 0};
            //TODO: Put this array somewhere more "configy"
            //Save global objects
            var attrsToCopy = ["id", "accX", "accY", "speedX", "speedY", "collideBorderB", "collideBorderL", "collideBorderR", "collideBorderT", "collisionActions", "facing", "height", "width", "keyActions", "maxSpeed", "name", "objectType", "maxX", "maxY", "minX", "minY", "movementType", "onClickActions", "onCreateActions", "onDestroyActions", "parentCounters", "counters"];
            var objects = GameCreator.globalObjects;
            var name, oldObject, newObject, i, attribute, scene, newScene, n;
            for (name in objects) {
                if (objects.hasOwnProperty(name)) {
                    oldObject = objects[name];
                    newObject = {};
                    for (i = 0; i < attrsToCopy.length; i += 1) {
                        attribute = attrsToCopy[i];
                        if (oldObject.hasOwnProperty(attribute)) {
                            newObject[attribute] = oldObject[attribute];
                        }
                    }

                    this.dereferenceCounters(newObject);

                    newObject.imageSrc = $(oldObject.image).attr("src");
                    results.globalObjects[newObject.objectName] = newObject;
                }
            }
            //Save scenes
            for (i = 0; i < GameCreator.scenes.length; i += 1) {
                scene = GameCreator.scenes[i];
                newScene = [];
                for (n = 0; n < scene.length; n += 1) {
                    oldObject = scene[n];
                    //Need to reset counters before saving to make sure mappings to parentcounters are set up.
                    GameCreator.resetCounters(oldObject, oldObject.parent.parentCounters);
                    newObject = $.extend({}, oldObject);
                    //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                    newObject.parent = oldObject.parent.objectName;
                    //Same for counters
                    this.dereferenceCounters(newObject);
                    newObject.instantiate = undefined;
                    newScene.push(newObject);
                }
                results.scenes.push(newScene);
            }
            results.idCounter = GameCreator.idCounter;
            results.globalIdCounter = GameCreator.globalIdCounter;
            return JSON.stringify(results);
        },

        restoreState: function(savedJson) {
            var i, n, parsedSave, name, object, newObject, newScene, savedScene;
            //Remove old state
            for (i = 0; i < GameCreator.scenes.length; i += 1) {
                for (n = 0; n < GameCreator.scenes[i].length; n += 1) {
                    GameCreator.scenes[i][n].parent.destroy.call(GameCreator.scenes[i][n]);
                }
            }
            GameCreator.scenes = [];
            GameCreator.globalObjects = {};
            $("#global-object-list").html("");
            //Load globalObjects
            parsedSave = JSON.parse(savedJson);
            for (name in parsedSave.globalObjects) {
                if (parsedSave.globalObjects.hasOwnProperty(name)) {
                    object = parsedSave.globalObjects[name];
                    newObject = GameCreator[object.objectType].createFromSaved(object);

                    GameCreator.referenceCounters(object);

                    GameCreator.UI.createLibraryItem(newObject);
                }
            }
            //Load scenes
            for (i = 0; i < parsedSave.scenes.length; i += 1) {
                newScene = [];
                savedScene = parsedSave.scenes[i];
                for (n = 0; n < savedScene.length; n += 1) {
                    object = savedScene[n];
                    GameCreator.createSceneObject(GameCreator.globalObjects[object.objectName], newScene, object);
                    GameCreator.referenceCounters(object);
                }
                GameCreator.scenes.push(newScene);
            }
            GameCreator.idCounter = parsedSave.idCounter;
            GameCreator.globalIdCounter = parsedSave.globalIdCounter;
            GameCreator.editScene(GameCreator.scenes[0]);
        },

        //Since all inputs are tagged with "data-attrname" and "data-type" we have this general function for saving all object types.
        saveFormInputToObject: function(formId, obj) {
            var inputs = $("#" + formId + " input, #" + formId + " select");
            var input, i, attrName;
            for (i = 0; i < inputs.length; i += 1) {
                input = $(inputs[i]);
                attrName = input.attr('data-attrname');
                if (attrName) {
                    attrName = attrName.split('.');
                    if (attrName.length === 1) {
                        obj[attrName[0]] = GameCreator.helpers.getValue(input);
                    } else {
                        obj[attrName[0]] = obj[attrName[0]] || {};                       
                        obj[attrName[0]][attrName[1]] = GameCreator.helpers.getValue(input);
                    }
                }
            }
        },

        deleteSelectedObject: function() {
            GameCreator.invalidate(GameCreator.selectedObject);
            GameCreator.selectedObject.remove();
            GameCreator.unselectSceneObject();
            GameCreator.render();
        },

        saveSceneObject: function(formId, obj) {
            GameCreator.saveFormInputToObject(formId, obj);
            GameCreator.hideRoute();
            obj.update();
            GameCreator.render();
        },

        unselectSceneObject: function() {
            GameCreator.selectedObject = null;
            GameCreator.UI.unselectSceneObject();
        },

        hideRoute: function() {
            $(".routeNodeContainer").remove();
        },

        drawRoute: function(route) {
            GameCreator.hideRoute();
            var node, i;
            for (i = 0; i < route.length; i += 1) {
                node = route[i];
                $("body").append(GameCreator.htmlStrings.routeNode(node, i));
            }
            $(".routeNode").on("mousedown", function() {
                GameCreator.draggedNode = this;
                return false;
            });
        },

        getClickedObjectEditing: function(x, y) {
            var i, obj;
            for (i = GameCreator.renderableObjects.length - 1; i >= 0; i -= 1) {
                obj = GameCreator.renderableObjects[i];
                if (x >= obj.x && x <= obj.x + obj.displayWidth && y >= obj.y && y <= obj.y + obj.displayHeight) {
                    obj.clickOffsetX = x - obj.x;
                    obj.clickOffsetY = y - obj.y;
                    return obj;
                }
            }
            return null;
        },

        addScene: function() {
            GameCreator.scenes.push([]);
            GameCreator.UI.setupSceneTabs(GameCreator.scenes);
        }
    });
}());