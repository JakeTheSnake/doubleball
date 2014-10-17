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
            GameCreator.UI.hideEditModeTools();
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
                var mouseX, mouseY, offsetTop, offsetLeft;
                if (GameCreator.draggedNode) {
                    mouseX = e.pageX;
                    mouseY = e.pageY;
                    offsetTop = $("#main-canvas").offset().top;
                    offsetLeft = $("#main-canvas").offset().left;

                    if (mouseX < offsetLeft) mouseX = offsetLeft;
                    if (mouseY < offsetTop) mouseY = offsetTop;
                    if (mouseX > offsetLeft + GameCreator.width) mouseX = offsetLeft + GameCreator.width;
                    if (mouseY > offsetTop + GameCreator.height) mouseY = offsetTop + GameCreator.height;

                    $(GameCreator.draggedNode).parent().css("top", mouseY);
                    $(GameCreator.draggedNode).parent().css("left", mouseX);
                    return false;
                }
            });
            $(window).on("mouseup.editScene", function(e) {
                if (GameCreator.draggedNode) {
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - $("#main-canvas").offset().left;
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - $("#main-canvas").offset().top;
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
                    if (GameCreator.hoveredObject.route) {
                        GameCreator.drawRoute(GameCreator.hoveredObject.route);
                    }
                    dragFunc = GameCreator.hoveredObject.getDragFunction(mouseLeft, mouseTop);
                    GameCreator.selectedObject = GameCreator.hoveredObject;
                    GameCreator.UI.editSceneObject();
                } else {
                    dragFunc = null;
                    GameCreator.selectedObject = null;
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

        dereferenceImage: function(globalObj) {
            for(var i = 0; i < globalObj.states.length; i += 1) {
                globalObj.states[i].attributes.image = globalObj.states[i].attributes.image.src;
            }
        },

        referenceImage: function(globalObj) {
            var i, img;
            for(i = 0; i < globalObj.states.length; i += 1) {
                img = new Image();
                img.src = globalObj.states[i].attributes.image;
                globalObj.states[i].attributes.image = img;
                img.onload = function() {
                    $(img).data('loaded', true);
                    GameCreator.render();
                };
            }
        },

        saveState: function() {
            var results = {globalObjects: {}, scenes: [], idCounter: 0};
            //TODO: Put this array somewhere more "configy"
            //Save global objects
            var propsToCopy = ['attributes', 'id', 'objectName', 'objectType', 'onClickSets',
                'onCollideSets', 'onCreateSets', 'onDestroySets', 'onKeySets', 'parentCounters', 'states'];
            var objects = GameCreator.globalObjects;
            var name, names, oldObject, newObject, i, j, attribute, scene, newScene, n;
            names = Object.keys(objects);
            for (j = 0; j < names.length; j += 1) {
                name = names[j];
                oldObject = objects[name];
                newObject = {};
                for (i = 0; i < propsToCopy.length; i += 1) {
                    attribute = propsToCopy[i];
                    if (oldObject.hasOwnProperty(attribute)) {
                        newObject[attribute] = oldObject[attribute];
                    }
                }
                GameCreator.dereferenceImage(newObject);
                results.globalObjects[newObject.objectName] = newObject;
            }
            //Save scenes
            for (i = 0; i < GameCreator.scenes.length; i += 1) {
                scene = GameCreator.scenes[i];
                newScene = new GameCreator.Scene(scene.id);
                for (n = 0; n < scene.objects.length; n += 1) {
                    oldObject = scene.objects[n];
                    newObject = {};
                    newObject.attributes = oldObject.attributes;
                    
                    //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                    newObject.parent = oldObject.parent.objectName;
                    //Same for counters
                    newScene.addSceneObject(newObject);
                }
                results.scenes.push(newScene);
            }
            results.idCounter = GameCreator.idCounter;
            results.globalIdCounter = GameCreator.globalIdCounter;
            results.uniqueSceneId = GameCreator.uniqueSceneId;
            console.log(results);
            return JSON.stringify(results);
        },

        restoreState: function(savedJson) {
            var i, n, parsedSave, name, oldObject, newObject, newScene, savedScene;
            GameCreator.scenes = [];
            GameCreator.globalObjects = {};
            $(".global-object-list").empty();
            GameCreator.renderableObjects = [];
            //Load globalObjects
            parsedSave = JSON.parse(savedJson);
            var globalObjects = Object.keys(parsedSave.globalObjects);
            globalObjects.forEach(function(objName) {
                oldObject = parsedSave.globalObjects[objName];

                newObject = new GameCreator[oldObject.objectType]({});
        
                $.extend(newObject, oldObject);

                if (newObject.onClickSets) {
                    newObject.onClickSets = newObject.onClickSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                }
                if (newObject.onCreateSets) {
                    newObject.onCreateSets = newObject.onCreateSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                }
                if (newObject.onDestroySets) {
                    newObject.onDestroySets = newObject.onDestroySets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                }
                if (newObject.onCollideSets) {
                    newObject.onCollideSets.forEach(function(collideArray){
                        collideArray.caSets = collideArray.caSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                    });
                }
                if (newObject.onKeySets) {
                    var keys = Object.keys(newObject.onKeySets);
                    keys.forEach(function(key){
                        newObject.onKeySets[key] = newObject.onKeySets[key].map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                    });
                }

                GameCreator.globalObjects[newObject.objectName] = newObject;
                GameCreator.referenceImage(newObject);

                GameCreator.UI.createLibraryItem(newObject);
            });
            
            //Load scenes
            for (i = 0; i < parsedSave.scenes.length; i += 1) {
                savedScene = parsedSave.scenes[i];
                newScene = new GameCreator.Scene(savedScene.id);
                for (n = 0; n < savedScene.objects.length; n += 1) {
                    newObject = savedScene.objects[n];
                    GameCreator.createSceneObject(GameCreator.globalObjects[newObject.parent], newScene, newObject.attributes);
                }
                GameCreator.scenes.push(newScene);
            }
            GameCreator.idCounter = parsedSave.idCounter;
            GameCreator.globalIdCounter = parsedSave.globalIdCounter;
            GameCreator.uniqueSceneId = parsedSave.uniqueSceneId;
            GameCreator.editScene(GameCreator.scenes[0]);
        },

        restoreCaSet: function(caSet) {
            var newCaSet = new GameCreator.ConditionActionSet({});
            $.extend(newCaSet, caSet);
            newCaSet.actions = newCaSet.actions.map(function(action){
                return $.extend(new GameCreator.RuntimeAction(), action);
            });
            newCaSet.conditions = newCaSet.conditions.map(function(action){
                return $.extend(new GameCreator.RuntimeCondition(), action);
            });
            return newCaSet;
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
            var value;
            var attrName = input.data('attrname');
            if (attrName) {
                attrName = attrName.split('.');
                value = GameCreator.helpers.getValue(input);
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
                GameCreator.setupRouteNode(node, i);
            }
            $(".routeNode").on("mousedown", function() {
                GameCreator.draggedNode = this;
                return false;
            });
            $(".routeNodeActions .add-node-button").on("click", function() {
                GameCreator.selectedObject.insertNode($(this).data('index'));
            });
            $(".routeNodeActions .remove-node-button").on("click", function() {
                GameCreator.selectedObject.removeNode($(this).data('index'));
            });
            $(".routeNodeActions .toggle-bounce-node-button").on("click", function() {
                GameCreator.selectedObject.toggleBounceNode($(this).data('index'));
            });
        },

        setupRouteNode: function(node, i) {
            $("body").append(GameCreator.htmlStrings.routeNode(node, i));
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