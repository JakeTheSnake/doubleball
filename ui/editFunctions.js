/*global GameCreator, $, Image, window*/
(function() {
    "use strict";
    $.extend(GameCreator, {

        selectedLibraryObject: undefined,

        directions: {
            Default: "Default",
            Up: "Up",
            Down: "Down",
            Left: "Left",
            Right: "Right",
            Towards: "Towards"
        },

        objectTypeGroups: {
            playerObjectTypes: {
                'Topdown Object': 'TopDownObject',
                'Mouse Object': 'MouseObject',
                'Platform Object': 'PlatformObject',
            },
            gameObjectTypes: {
                'Free Object': 'FreeObject',
                'Route Object': 'RouteObject',
                'Text Object': 'TextObject'
            },
            counterDisplayTypes: {
                'Text Display': 'CounterDisplayText',
                'Image Display': 'CounterDisplayImage'
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

        addTempGlobalObjectToGame: function(globalObj) {
            GameCreator.globalIdCounter += 1;
            globalObj.id = GameCreator.globalIdCounter;
            GameCreator.UI.createLibraryItem(globalObj);
            GameCreator.globalObjects[globalObj.objectName] = globalObj;
        },

        directActiveScene: function() {
            GameCreator.directScene(GameCreator.getActiveScene());
        },

        directScene: function(scene) {
            GameCreator.resetScene(scene);
            GameCreator.initializeKeyListeners();
            GameCreator.UI.hideEditModeTools();
            var startNewGameLoop = GameCreator.state !== 'directing' && GameCreator.state !== 'playing';
            GameCreator.state = 'directing';
            if (startNewGameLoop) GameCreator.gameLoop();
        },

        playGameEditing: function() {
            GameCreator.UI.hideEditModeTools();
            GameCreator.playScene(GameCreator.scenes[0]);
        },

        editGame: function() {
            $(".global-object-list").empty();
            var keys = Object.keys(GameCreator.globalObjects);
            keys.forEach(function(objectName) {
                GameCreator.UI.createLibraryItem(GameCreator.globalObjects[objectName]);
            });
            GameCreator.editScene(GameCreator.scenes[0]);
        },

        drawObjectSelectedUI: function() {
            GameCreator.drawSelectionLine();
            GameCreator.drawMouseMovementArea();
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

        drawMouseMovementArea: function() {
            if(GameCreator.selectedObject && GameCreator.selectedObject.parent.objectType === 'MouseObject') {
                var selobj = GameCreator.selectedObject;
                var context = GameCreator.uiContext;
                context.beginPath();
                context.setLineDash([5]);
                context.strokeStyle = '#f00'
                context.moveTo(selobj.attributes.minX+2, selobj.attributes.minY+2);
                context.lineTo(selobj.attributes.maxX-2, selobj.attributes.minY+2);
                context.lineTo(selobj.attributes.maxX-2, selobj.attributes.maxY-2);
                context.lineTo(selobj.attributes.minX+2, selobj.attributes.maxY-2);
                context.closePath();
                context.stroke();
                context.setLineDash([0]);
                context.strokeStyle = '#000'
            }
        },

        stopEditing: function() {
            $(GameCreator.mainCanvas).off(".editScene");
            $(window).off(".editScene");
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
            GameCreator.resetGlobalCounters();
            scene.reset();
            GameCreator.selectedObject = null;
            GameCreator.setupScenePropertiesForm();
            GameCreator.UI.drawSceneObjectLibrary();
            scene.drawBackground();
            GameCreator.state = 'editing';
            GameCreator.UI.showEditModeTools();

            //Here we populate the renderableObjects only since the other kinds are unused for editing. Also we use the actual sceneObjects in the
            //renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
            for (i = 0; i < scene.objects.length; i += 1) {
                obj = scene.objects[i];
                if (obj.parent.isRenderable) {
                    GameCreator.renderableObjects.push(obj);
                    GameCreator.render(true);
                }
            }

            GameCreator.resetGlobalObjects();

            $(window).on("mousemove.editScene", function(e) {
                var mouseX, mouseY;
                if (GameCreator.draggedNode) {
                    mouseX = GameCreator.helpers.getValidXCoordinate(e.pageX);
                    mouseY = GameCreator.helpers.getValidYCoordinate(e.pageY);

                    $(GameCreator.draggedNode).parent().css("top", mouseY);
                    $(GameCreator.draggedNode).parent().css("left", mouseX);
                    return false;
                }
            });
            $(window).on("mouseup.editScene", function(e) {
                var mouseX, mouseY;
                if (GameCreator.draggedNode) {
                    mouseX = GameCreator.helpers.getValidXCoordinate(e.pageX);
                    mouseY = GameCreator.helpers.getValidYCoordinate(e.pageY);
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = mouseX - $("#main-canvas").offset().left;
                    GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = mouseY - $("#main-canvas").offset().top;
                    GameCreator.draggedNode = undefined;
                    GameCreator.drawRoute(GameCreator.selectedObject.route);
                    return false;
                }
            });
            $(GameCreator.mainCanvas).on("mousedown.editScene", function(e) {
                mouseLeft = e.pageX - $("#main-canvas").offset().left;
                mouseTop = e.pageY - $("#main-canvas").offset().top;
                GameCreator.hoveredObject = GameCreator.getObjectAtCoordinates(mouseLeft, mouseTop);
                if (GameCreator.selectedObject && !GameCreator.hoveredObject) {
                    dragFunc = GameCreator.selectedObject.getDragFunction(mouseLeft, mouseTop);
                    if (dragFunc) {
                        $('.route-node-container').addClass('dragging');
                    } else {
                        dragFunc = null;
                        GameCreator.selectedObject = null;
                        GameCreator.drawSelectionLine();
                        GameCreator.hideRoute();
                        $('.library-scene-object-button').removeClass('active');
                        GameCreator.setupScenePropertiesForm();
                    }
                }
                else if (GameCreator.hoveredObject) {
                    dragFunc = GameCreator.hoveredObject.getDragFunction(mouseLeft, mouseTop);
                    GameCreator.selectedObject = GameCreator.hoveredObject;
                    GameCreator.UI.editSceneObject();
                    $('.route-node-container').addClass('dragging');
                }
                GameCreator.render(false);
            });
            $(window).on("mouseup.editScene", function(e) {
                if (GameCreator.hoveredObject) {
                    GameCreator.hoveredObject.cleanupSize();
                    GameCreator.hoveredObject = undefined;
                }
                $('.route-node-container').removeClass('dragging');
                dragFunc = null;
                GameCreator.helpers.setMouseCursor(dragFunc);
            });
            $(GameCreator.mainCanvas).on("mousemove.editScene", function(e) {
                mouseLeft = e.pageX - $("#main-canvas").offset().left;
                mouseTop = e.pageY - $("#main-canvas").offset().top;

                if (GameCreator.selectedObject) {

                    GameCreator.helpers.setMouseCursor(GameCreator.selectedObject.getDragFunction(mouseLeft, mouseTop));

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

            $("#toolbar-bottom > .col.right").show();
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
                var caSet;
                var activeScene = GameCreator.getActiveScene();
                $('#side-properties-form-container').html(GameCreator.htmlStrings.getScenePropertiesForm());
                GameCreator.helpers.populateSidePropertiesForm(GameCreator.getActiveScene(), onChangeCallback);
                GameCreator.getActiveScene().drawBackground();
                $('#setup-scene-actions').click(function() {
                    GameCreator.UI.openSelectActionsDialogue(
                        GameCreator.htmlStrings.sceneStartedEventInformationWindow(),
                        activeScene.onCreateSet, 'scenestart', 
                        activeScene.attributes.name
                    );
                });
                $(document).off('GameCreator.sceneAdded').on('GameCreator.sceneAdded', function(){
                    $('#delete-scene-button').removeClass('disabled');
                });
                if(GameCreator.scenes.length === 1) {
                    $('#delete-scene-button').addClass('disabled');
                }
                $('#delete-scene-button').click(function(){
                    GameCreator.removeScene(activeScene);
                });
            }, 0);
        },

        dereferenceImage: function(globalObj) {
            for(var i = 0; i < globalObj.states.length; i += 1) {
                if (globalObj.states[i].attributes.image) {
                    globalObj.states[i].attributes.image = globalObj.states[i].attributes.image.src;
                }
            }
        },

        saveGlobalObjects: function() {
            var savedGlobalObjects = {};
            var propsToCopy = ['attributes', 'id', 'objectName', 'objectType', 'onClickSets',
                'onCollideSets', 'onCreateSets', 'onDestroySets', 'onKeySets', 'parentCounters', 'states'];
            var objects = GameCreator.globalObjects;
            var name, names, oldObject, newObject, i, j, attribute;
            names = Object.keys(objects);
            for (j = 0; j < names.length; j += 1) {
                name = names[j];
                oldObject = $.extend(true, {}, objects[name]);
                newObject = {};
                for (i = 0; i < propsToCopy.length; i += 1) {
                    attribute = propsToCopy[i];
                    if (oldObject.hasOwnProperty(attribute)) {
                        newObject[attribute] = oldObject[attribute];
                    }
                }
                GameCreator.dereferenceImage(newObject);
                savedGlobalObjects[newObject.objectName] = newObject;
            }
            return savedGlobalObjects;
        },

        saveScenes: function() {
            var savedScenes = [];
            var scene, newScene, newObject, oldObject;
            for (var i = 0; i < GameCreator.scenes.length; i += 1) {
                scene = GameCreator.scenes[i];
                newScene = new GameCreator.Scene(scene.id);
                for (var n = 0; n < scene.objects.length; n += 1) {
                    oldObject = $.extend(true, {}, scene.objects[n]);
                    newObject = {};
                    newObject.attributes = oldObject.attributes;
                    newObject.route = oldObject.route;
                    delete newObject.attributes.image;
                    
                    //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                    newObject.parent = oldObject.parent.objectName;
                    //Same for counters
                    newScene.addSceneObject(newObject);
                }
                newScene.attributes.bgImage = scene.attributes.bgImage ? scene.attributes.bgImage.src : null;
                newScene.attributes.bgColor = scene.attributes.bgColor;
                newScene.attributes.name = scene.attributes.name;
                newScene.onCreateSet = scene.onCreateSet;
                savedScenes.push(newScene);
            }
            return savedScenes;
        },


        saveState: function() {
            var results = {globalObjects: {}, scenes: [], globalCounters: {}};

            results.globalObjects = GameCreator.saveGlobalObjects();
            results.scenes = GameCreator.saveScenes();
            results.globalCounters = GameCreator.globalCounters;
            results.globalIdCounter = GameCreator.globalIdCounter;
            results.uniqueSceneId = GameCreator.uniqueSceneId;
            results.version = {
                major: GameCreator.version.major,
                minor: GameCreator.version.minor,
                patch: GameCreator.version.patch
            };
            results.width = GameCreator.width;
            results.height = GameCreator.height;
            return JSON.stringify(results);
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
            $(".route-node-container").remove();
        },

        drawRoute: function(route) {
            GameCreator.hideRoute();
            var node, i;
            for (i = 0; i < route.length; i += 1) {
                node = route[i];
                GameCreator.setupRouteNode(node, i);
            }
            $(".route-node").on("mousedown", function() {
                GameCreator.draggedNode = this;
                return false;
            });
            $(".route-node-actions .add-node-button").on("click", function() {
                GameCreator.selectedObject.insertNode($(this).data('index'));
            });
            $(".route-node-actions .remove-node-button").on("click", function() {
                GameCreator.selectedObject.removeNode($(this).data('index'));
            });
            $(".route-node-actions .toggle-bounce-node-button").on("click", function() {
                GameCreator.selectedObject.toggleBounceNode($(this).data('index'));
            });
        },

        setupRouteNode: function(node, i) {
            $("body").append(GameCreator.htmlStrings.routeNode(node, i));
        },

        getObjectAtCoordinates: function(x, y) {
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
            $(document).trigger('GameCreator.sceneAdded');
        },

        removeScene: function(scene) {
            var index = GameCreator.scenes.indexOf(scene);
            GameCreator.scenes.splice(index, 1);
            GameCreator.UI.setupSceneTabs();

            GameCreator.activeSceneId = GameCreator.scenes[index] ? GameCreator.scenes[index].id : GameCreator.scenes[GameCreator.scenes.length - 1].id;
            GameCreator.editActiveScene();
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

        renameGlobalObject: function(oldName, newName) {
            if (oldName !== newName) {
                if (GameCreator.globalObjects[newName] !== undefined) {
                    throw "Name '" + newName + "'  already exists";
                }
                GameCreator.globalObjects[newName] = GameCreator.globalObjects[oldName];
                delete GameCreator.globalObjects[oldName];
                GameCreator.globalObjects[newName].objectName = newName;
            }
        },

        removeGlobalObject: function(globalObjId) {
            GameCreator.removeCounterReferencesToGlobalObject(globalObjId);
            var globalObjects = Object.keys(GameCreator.globalObjects);
            for (var i = 0; i < globalObjects.length; i += 1) {
                var globalObj = GameCreator.globalObjects[globalObjects[i]];
                for (var prop in globalObj) {
                    if (globalObj.hasOwnProperty(prop) && prop.includes("Sets")) {
                        GameCreator.removeReferencesToGlobalObject(globalObj[prop], globalObjId);
                    }
                }
            }
            for (var i = 0; i < GameCreator.scenes.length; i += 1) {
                GameCreator.scenes[i].onCreateSet.removeReferencesToGlobalObject(globalObjId);
            }
            GameCreator.removeGlobalObjectFromScenes(globalObjId);
            var globalObj = GameCreator.helpers.getGlobalObjectById(globalObjId);
            delete GameCreator.globalObjects[globalObj.objectName];
        },

        removeCounterReferencesToGlobalObject: function(globalObjId) {
            var globalObj = GameCreator.helpers.getGlobalObjectById(globalObjId);

            for (var i = 0; i < GameCreator.scenes.length; i += 1) {
                for (var j = 0; j < GameCreator.scenes[i].objects.length; j += 1) {
                    var sceneObject = GameCreator.scenes[i].objects[j];
                    var counterCarrier = GameCreator.scenes[i].getObjectById(sceneObject.attributes.counterCarrier);
                    if (counterCarrier != null && counterCarrier.parent.id === globalObjId) {
                        sceneObject.attributes.counterName = null;
                        sceneObject.attributes.counterCarrier = null;
                    }
                }
            }
        },

        removeReferencesToGlobalObject: function(currentObject, globalObjId) {
            if (currentObject instanceof Image) {
                return;
            } else if (currentObject instanceof Array) {
                for (var i = 0; i < currentObject.length; i += 1) {
                    if (currentObject[i] instanceof GameCreator.ConditionActionSet) {
                        currentObject[i].removeReferencesToGlobalObject(globalObjId);
                    } else {
                        GameCreator.removeReferencesToGlobalObject(currentObject[i], globalObjId);
                    }
                }
            } else if (currentObject instanceof Object) {
                var keys = Object.keys(currentObject);
                for (var i = 0; i < keys.length; i += 1) {
                    if (currentObject[keys[i]] instanceof GameCreator.ConditionActionSet) {
                        currentObject[keys[i]].removeReferencesToGlobalObject(globalObjId);
                    } else {
                        GameCreator.removeReferencesToGlobalObject(currentObject[keys[i]], globalObjId);
                    }

                }

            }
        },
    });
}());