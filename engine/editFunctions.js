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

        objectTypeGroups: {
            playerObjectTypes: {
                'Topdown Object': 'TopDownObject',
                'Mouse Object': 'MouseObject',
                'Platform Object': 'PlatformObject',
            },
            gameObjectTypes: {
                'Free Object': 'FreeObject',
                'Route Object': 'RouteObject'
            },
            counterObjectTypes: {
                'Text Counter': 'CounterObjectText',
                'Image Counter': 'CounterObjectImage'
            },
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
            GameCreator.directScene(GameCreator.getActiveScene());
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
                GameCreator.uiContext.moveTo(selobj.attributes.x+2, selobj.attributes.y+2);
                GameCreator.uiContext.lineTo(selobj.attributes.x-2 + selobj.displayWidth, selobj.attributes.y+2);
                GameCreator.uiContext.lineTo(selobj.attributes.x-2 + selobj.displayWidth, selobj.attributes.y-2 + selobj.displayHeight);
                GameCreator.uiContext.lineTo(selobj.attributes.x+2, selobj.attributes.y-2 + selobj.displayHeight);
                GameCreator.uiContext.closePath();
                GameCreator.uiContext.stroke();
            }
        },

        stopEditing: function() {
            $(GameCreator.mainCanvas).off(".editScene");
            GameCreator.selectedObject = null;
        },

        editActiveScene: function() {
            GameCreator.editScene(GameCreator.getActiveScene());
        },

        uniqueSceneId: 0,

        getUniqueSceneId: function() {
            GameCreator.uniqueSceneId += 1;
            return GameCreator.uniqueSceneId;
        },

        editScene: function(scene) {
            var i, obj, dragFunc, mouseLeft, mouseTop;
            GameCreator.reset();
            scene.reset();
            GameCreator.setupScenePropertiesForm();
            scene.drawBackground();
            GameCreator.state = 'editing';
            //Here we populate the renderableObjects only since the other kinds are unused for editing. Also we use the actual sceneObjects in the
            //renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
            for (i = 0; i < scene.objects.length; i += 1) {
                obj = scene.objects[i];
                if (obj.parent.isRenderable) {
                    GameCreator.renderableObjects.push(obj);
                    GameCreator.render(true);
                }
            }
            $(window).on("mousemove.editScene", function(e) {
                if (GameCreator.draggedNode) {
                    $(GameCreator.draggedNode).parent().css("top", e.pageY - 10);
                    $(GameCreator.draggedNode).parent().css("left", e.pageX - 10);
                    return false;
                }
            });
            $(window).on("mouseup.editScene", function(e) {
                if (GameCreator.draggedNode) {
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - GameCreator.mainCanvas.offsetLeft - 10;
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - GameCreator.mainCanvas.offsetTop - 10;
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
                    GameCreator.drawSelectionLine();
                    GameCreator.hideRoute();
                    GameCreator.setupScenePropertiesForm();
                }
                GameCreator.render(false);
            });
            $(GameCreator.mainCanvas).on("mouseup.editScene", function(e) {
                if (GameCreator.hoveredObject) {
                    GameCreator.hoveredObject.cleanupSize();
                    GameCreator.hoveredObject = undefined;
                }
                dragFunc = null;
                GameCreator.helpers.setMouseCursor(dragFunc);
            });
            $(GameCreator.mainCanvas).on("mousemove.editScene", function(e) {
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
                        GameCreator.UI.updateSceneObjectForm(GameCreator.selectedObject);

                    }
                    GameCreator.render(true);
                }
            });

            GameCreator.UI.setupSceneTabs();
            GameCreator.render(false);
        },

        setupScenePropertiesForm: function() {
            var onChangeCallback = function() {
                GameCreator.UI.setupSceneTabs();
                GameCreator.render(true);
                GameCreator.getActiveScene().drawBackground();
            };
            setTimeout(function() {
                $('#side-properties-form-container').html(GameCreator.htmlStrings.getScenePropertiesForm());
                GameCreator.helpers.populateSidePropertiesForm(GameCreator.getActiveScene(), onChangeCallback);
                GameCreator.getActiveScene().drawBackground();
            }, 0);
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
            $(".global-object-list").html("");
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

        saveFormInputToObject: function(formId, obj) {
            var inputs = $("#" + formId + " input, #" + formId + " select");
            var input, i;
            for (i = 0; i < inputs.length; i += 1) {
                input = $(inputs[i]);
                GameCreator.saveInputValueToObject(input, obj);
            }
        },

        saveInputValueToObject: function(input, obj) {
            var attrName = input.data('attrname');
            if (attrName) {
                attrName = attrName.split('.');
                var value = GameCreator.helpers.getValue(input);
                if (attrName.length === 1) {
                    obj[attrName[0]] = value;
                } else {
                    obj[attrName[0]] = obj[attrName[0]] || {};                       
                    obj[attrName[0]][attrName[1]] = value;
                }
                return value;
            }
        },

        deleteSelectedObject: function() {
            GameCreator.invalidate(GameCreator.selectedObject);
            GameCreator.selectedObject.remove();
            GameCreator.render();
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
                if (x >= obj.attributes.x && x <= obj.attributes.x + obj.displayWidth && y >= obj.attributes.y && y <= obj.attributes.y + obj.displayHeight) {
                    return obj;
                }
            }
            return null;
        },

        addScene: function() {
            GameCreator.scenes.push(new GameCreator.Scene());
            GameCreator.UI.setupSceneTabs();
        },

        getCountersForGlobalObj: function(globalObjName) {
            var obj, counter, tmpObj;
            var result = {};
            if (GameCreator.globalObjects.hasOwnProperty(globalObjName)) {
                obj = GameCreator.globalObjects[globalObjName];
            } else {
                tmpObj = GameCreator.getSceneObjectById(globalObjName);
                obj = tmpObj ? tmpObj.parent : null;
            }
            if (obj) {
                for (counter in obj.parentCounters) {
                    if (obj.parentCounters.hasOwnProperty(counter)) {
                        result[counter] = counter;
                    }
                }
            }
            return result;
        },

        getStatesForGlobalObj: function(globalObjName) {
            var obj, tmpObj, i;
            var result = {};
            if (GameCreator.globalObjects.hasOwnProperty(globalObjName)) {
                obj = GameCreator.globalObjects[globalObjName];
            } else {
                tmpObj = GameCreator.getSceneObjectById(globalObjName);
                obj = tmpObj ? tmpObj.parent : null;
            }
            if (obj) {
                for (i = 0; i < obj.states.length; i += 1) {                 
                    result[obj.states[i].name] = obj.states[i].id;
                }
            }
            return result;
        },
    });
}());