/*global GameCreator, $, Image, window, requestAnimationFrame, document*/
(function() {
    "use strict";
    window.GameCreator = {
        paused: false,
        state: 'editing', //State can be editing, directing or playing. 
        then: undefined, // The time before last frame

        globalObjects: {}, //Contains key value pairs where key is the (unique)name of the object.
        globalCounters: {},

        //Scene contains all objects that initially exist in one scene. It is used as a blueprint to create the runtime arrays of objects.
        scenes: [],
        activeSceneId: 0,

        sounds: {}, //All sounds within the current game

        //The runtime arrays contain the current state of the game.
        collidableObjects: [],
        movableObjects: [],
        renderableObjects: [],
        eventableObjects: [],
        
        objectsToDestroy: [],
        newlyCreatedObjects: [],
        currentEffects: [],
        bufferedActions: [],

        addObjFunctions: {},
        commonObjectFunctions: {},
        helpers: {},
        keys: {
            keyPressed: {
                shift: false,
                ctrl: false,
                alt: false,
                space: false,
                leftMouse: false,
                rightMouse: false
            }
        },

        selectedObject: undefined, //The currently selected scene object.
        hoveredObject: undefined,
        draggedNode: undefined,
        idCounter: 0, // Counter used for various unique ids.
        globalIdCounter: 0, // Counter used for global objects ID

        initialize: function() {
            var borderKeys = Object.keys(GameCreator.borderObjects);
            GameCreator.initializeBorderObjects();

            for (var i = 0; i < borderKeys.length; i += 1 ) {
                var borderObj = GameCreator.borderObjects[borderKeys[i]];
                GameCreator.addObjFunctions.commonObjectFunctions(borderObj);
                borderObj.getDefaultState = function() {
                    return {attributes: this.attributes};
                };
                borderObj.getCurrentState = function() {
                    return {attributes: this.attributes};
                };
                borderObj.getCurrentImage = function() {
                    return this.attributes.image;
                };
                borderObj.states = [];
                GameCreator.commonObjectFunctions.createState.call(borderObj, 'default', {});
            }
        },

        initializeBorderObjects: function() {
            GameCreator.borderObjects.borderL.attributes.height = GameCreator.height + 1000;
            GameCreator.borderObjects.borderR.attributes.x = GameCreator.width;
            GameCreator.borderObjects.borderR.attributes.height = GameCreator.height + 1000;
            GameCreator.borderObjects.borderT.attributes.width = GameCreator.width + 1000;
            GameCreator.borderObjects.borderB.attributes.width = GameCreator.width + 1000;
            GameCreator.borderObjects.borderB.attributes.y = GameCreator.height;
        },

        gameLoop: function() {
            var now = Date.now();
            var delta = now - GameCreator.then;

            if (!GameCreator.paused) {
                GameCreator.runFrame(delta);
            }
            GameCreator.render(false);
            if (GameCreator.state !== 'editing') {
                requestAnimationFrame(GameCreator.gameLoop);
            }
            GameCreator.then = now;
        },

        render: function (forceRender) {
            var i, obj;
            if (GameCreator.uiContext) {
                GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
                GameCreator.drawObjectSelectedUI();
            }
            GameCreator.mainContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
            for (i = 0; i < GameCreator.renderableObjects.length; i += 1) {
                obj = GameCreator.renderableObjects[i];
                // TODO: Deactivated invalidation
                //if (true || obj.invalidated || forceRender) {
                //    obj.parent.draw(this.mainContext, obj);
                //}
                obj.parent.draw(this.mainContext, obj);
            }
            GameCreator.drawEffects(this.mainContext);
        },

        drawEffects: function(context) {
            GameCreator.currentEffects.forEach(function(effect, index) {
                if (!effect.draw(context)) {
                    GameCreator.currentEffects.splice(index, 1);
                }
            });
        },

        runFrame: function(deltaTime) {
            GameCreator.runBufferedActions();
            GameCreator.updateSpeedForAllObjects(deltaTime);
            GameCreator.checkCollisions();
            GameCreator.moveAllObjects(deltaTime);
            GameCreator.checkKeyEvents();
            GameCreator.timerHandler.update(deltaTime);
            GameCreator.updateEffects(deltaTime);
            GameCreator.cleanupDestroyedObjects();
            GameCreator.callOnCreateForNewObjects();
            if (GameCreator.debug) {
                GameCreator.debug.calculateDebugInfo(deltaTime);
            }
        },

        runBufferedActions: function() {
            var i, item, j;
            for (i = 0; i < GameCreator.bufferedActions.length; i++) {
                item = GameCreator.bufferedActions[i];
                for (j = 0; j < item.actionArray.length; j++) {
                    item.actionArray[j].runAction(item.runtimeObj);
                }
            }
            GameCreator.bufferedActions.length = 0;
        },

        updateEffects: function(deltaTime) {
            var i;
            for (i = 0; i < GameCreator.currentEffects.length; i++) {
                GameCreator.currentEffects[i].update(deltaTime);
            }
        },

        updateSpeedForAllObjects: function(deltaTime) {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.movableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.movableObjects[i];
                    if(runtimeObj.parent.calculateSpeed) {
                        runtimeObj.parent.calculateSpeed.call(runtimeObj, deltaTime / 1000);
                    }
                }
            }
        },

        checkCollisions: function() {
            var j, i, runtimeObjects;
            for (j = 0; j < GameCreator.collidableObjects.length; j += 1) {
                runtimeObjects = GameCreator.collidableObjects[j].runtimeObjects;
                for (i = 0; i < runtimeObjects.length; i += 1) {
                    if(!GameCreator.paused) {
                        GameCreator.helpers.checkCollisions(runtimeObjects[i]);
                    }
                }
            }
        },

        moveAllObjects: function(deltaTime) {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.movableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.move.call(runtimeObj, deltaTime / 1000);
                }
            }
        },

        checkKeyEvents: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.eventableObjects.length; i += 1) {
                if (!GameCreator.paused) {
                    runtimeObj = GameCreator.eventableObjects[i];
                    runtimeObj.parent.checkEvents.call(runtimeObj);
                }
            }
            GameCreator.releasePendingKeys();
        },

        releasePendingKeys: function() {
            var keys = Object.keys(GameCreator.keys.keyPressed);
            keys.forEach(function(key) {
                if (GameCreator.keys.pendingRelease[key]) {
                    GameCreator.keys.keyPressed[key] = false;
                    GameCreator.keys.pendingRelease[key] = false;
                }
            });
        },

        cleanupDestroyedObjects: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.objectsToDestroy.length; i += 1) {
                runtimeObj = GameCreator.objectsToDestroy[i];
                runtimeObj.parent.removeFromGame.call(runtimeObj);
            }
        },

        callOnCreateForNewObjects: function() {
            var i, runtimeObj;
            for (i = 0; i < GameCreator.newlyCreatedObjects.length; i += 1) {
                runtimeObj = GameCreator.newlyCreatedObjects[i];
                runtimeObj.parent.onCreate.call(runtimeObj);
            }
        },

        invalidate: function(obj) {
            /*var width, height;
            var x = parseInt(obj.attributes.x, 10);
            var y = parseInt(obj.attributes.y, 10);
            var xCorr = 0;
            var yCorr = 0;
            if (obj.attributes.x < 0) {
                xCorr = x;
                x = 0;
            }
            if (obj.attributes.y < 0) {
                yCorr = y;
                y = 0;
            }
            if (GameCreator.state == 'editing') {
                width = obj.displayWidth;
                height = obj.displayHeight;
            } else {
                width = parseInt(obj.attributes.width, 10);
                height = parseInt(obj.attributes.height, 10);
            }
            GameCreator.mainContext.clearRect(x, y,
                width + xCorr + 1,
                height + yCorr + 1);
            obj.invalidated = true;*/
        },

        reset: function() {
            if (GameCreator.uiContext) {
                GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
            }
            GameCreator.mainContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
            GameCreator.bgContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
            GameCreator.timerHandler.clear();
            this.collidableObjects = [];
            this.movableObjects = [];
            this.renderableObjects = [];
            this.objectsToDestroy = [];
            this.eventableObjects = [];
            $(document).off("keydown.gameKeyListener");
            $(document).off("keyup.gameKeyListener");
            $(document).off("mousemove.gameKeyListener");
            $(document).off("mousedown.gameKeyListener");
            $(document).off("mouseup.gameKeyListener");
            $(GameCreator.mainCanvas).off(".runningScene");
            $(GameCreator.mainCanvas).css("cursor", "default");
            var globalObjects = Object.keys(GameCreator.globalObjects);
            globalObjects.forEach(function(objectName) {
                if(GameCreator.globalObjects[objectName].resetKeys) { 
                    GameCreator.globalObjects[objectName].resetKeys();
                }
            });
        },
        pauseGame: function() {
            var objectName, obj, keyName;
            GameCreator.paused = true;
            $(document).off("keydown.gameKeyListener");
            $(document).off("keyup.gameKeyListener");
            $(document).off("mousemove.gameKeyListener");
            $(document).off("mousedown.gameKeyListener");
            $(document).off("mouseup.gameKeyListener");
            $(GameCreator.mainCanvas).css("cursor", "default");
            //Set all keypresses to false here since we turn off keyUp.
            for (objectName in GameCreator.globalObjects) {
                if (GameCreator.globalObjects.hasOwnProperty(objectName)) {
                    obj = GameCreator.globalObjects[objectName];
                    if (obj.keyPressed) {
                        for (keyName in obj.keyPressed) {
                            if (obj.keyPressed.hasOwnProperty(keyName)) {
                                obj.keyPressed[keyName] = false;
                                if (obj.keyUpPressed) {
                                    obj.keyUpPressed = false;
                                }
                                if (obj.keyDownPressed) {
                                    obj.keyDownPressed = false;
                                }
                                if (obj.keyLeftPressed) {
                                    obj.keyLeftPressed = false;
                                }
                                if (obj.keyRightPressed) {
                                    obj.keyRightPressed = false;
                                }
                            }
                        }
                    }
                }
            }
        },
        restartGame: function() {
            if (GameCreator.state === 'directing') {
                GameCreator.resetScene(GameCreator.scenes[0]);
            } else if (GameCreator.state === 'playing') {
                GameCreator.resetScene(GameCreator.scenes[0]);
            }
        },
        resumeGame: function() {
            GameCreator.paused = false;
            Object.keys(GameCreator.globalObjects).forEach(function(objectName){
                GameCreator.globalObjects[objectName].onGameStarted();
            });

            GameCreator.renderableObjects.forEach(function(runtimeObject){
                runtimeObject.parent.objectEnteredGame();
            });
        },
        createRuntimeObject: function(globalObj, args) {
            var runtimeObj = new GameCreator.SceneObject();
            if (globalObj.hasOwnProperty("objectToCreate")) {
                args.x = globalObj.x;
                args.y = globalObj.y;
                globalObj = GameCreator.globalObjects[globalObj.objectToCreate];
            }
            runtimeObj.instantiate(globalObj, args);
            runtimeObj.reset();
            GameCreator.addToRuntime(runtimeObj);
            globalObj.objectEnteredGame();
            return runtimeObj;
        },

        addToRuntime: function(runtimeObj) {
            if (runtimeObj.parent.isCollidable) {
                if (!GameCreator.helpers.getObjectById(GameCreator.collidableObjects, runtimeObj.parent.id)) {
                    GameCreator.collidableObjects.push({id: runtimeObj.parent.id, runtimeObjects: []});
                }
                GameCreator.helpers.getObjectById(GameCreator.collidableObjects, runtimeObj.parent.id).runtimeObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isMovable) {
                GameCreator.movableObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isRenderable) {
                GameCreator.renderableObjects.push(runtimeObj);
            }
            if (runtimeObj.parent.isEventable) {
                GameCreator.eventableObjects.push(runtimeObj);
            }
            runtimeObj.parent.initialize.call(runtimeObj);
            GameCreator.newlyCreatedObjects.push(runtimeObj);
        },
        getGlobalObjects: function() {
            var globalObj;
            var allGlobalObjects = {};
            for (globalObj in GameCreator.globalObjects) {
                if (GameCreator.globalObjects.hasOwnProperty(globalObj)) {
                    allGlobalObjects[globalObj] = globalObj;
                }
            }
            return allGlobalObjects;
        },

        changeCounter: function(runtimeObj, params) {
            var selectedObjectId = params.objId;
            var counterName = params.counter;
            var counterCarrier, runtimeObjects;

            var changeValue = function(counter) {
                if (params.type === 'set') {
                    counter.setValue(params.value);
                } else if (params.type === 'add') {
                    counter.changeValue(params.value);
                } else {
                    counter.changeValue(-params.value);
                }
            };

            if (selectedObjectId === 'globalCounters') {
                changeValue(GameCreator.globalCounters[counterName]);
            } else {
                if (selectedObjectId && selectedObjectId !== 'this') {
                    runtimeObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(selectedObjectId));
                } else {
                    runtimeObjects = [runtimeObj];
                }
                for (var i = 0; i < runtimeObjects.length; i += 1) {
                    if (runtimeObjects[i].parent.attributes.unique) {
                        counterCarrier = runtimeObjects[i].parent;
                    } else {
                        counterCarrier = runtimeObjects[i];
                    }
                    changeValue(counterCarrier.counters[counterName]);
                }
            }
        },

        changeState: function(runtimeObj, params) {
            var i, selectedObjectId = params.objectId;
            if (selectedObjectId && selectedObjectId !== 'this') {
                var runtimeObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(selectedObjectId));
                for (i = 0; i < runtimeObjects.length; i += 1) {
                    runtimeObjects[i].setState(Number(params.objectState));
                }
            } else {
                runtimeObj.setState(Number(params.objectState));
            }
        },
        
        getClickedObject: function(x, y) {
            var i, runtimeObj;
            for (i = GameCreator.renderableObjects.length - 1; i >= 0; i -= 1) {
                runtimeObj = GameCreator.renderableObjects[i];
                // If in edit mode, this should look for displayWidth instead.
                if (x >= runtimeObj.attributes.x &&
                    x <= runtimeObj.attributes.x + runtimeObj.attributes.width &&
                    y >= runtimeObj.attributes.y &&
                    y <= runtimeObj.attributes.y + runtimeObj.attributes.height && runtimeObj.parent.isClickable)
                {
                    runtimeObj.clickOffsetX = x - runtimeObj.attributes.x;
                    runtimeObj.clickOffsetY = y - runtimeObj.attributes.y;
                    return runtimeObj;
                }
            }
            return null;
        },
        getRuntimeObject: function(instanceId) {
            var i, collidableObj, movableObj, renderableObj, eventableObj;
            for (i = 0; i < GameCreator.collidableObjects.length; i += 1) {
                collidableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.collidableObjects[i].runtimeObjects, instanceId);
                if (collidableObj) {
                    return collidableObj;
                }
            }
            movableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.movableObjects, instanceId);
            if (movableObj) {
                return movableObj;
            }
            renderableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.renderableObjects, instanceId);
            if (renderableObj) {
                return renderableObj;
            }
            eventableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.eventableObjects, instanceId);
            if (eventableObj) {
                return eventableObj;
            }
            return null;
        },
        getRuntimeObjectFromCollection: function(collection, instanceId) {
            var i;
            for (i = 0; i < collection.length; i += 1) {
                if (collection[i].attributes.instanceId === instanceId) {
                    return collection[i];
                }
            }
        },
        getUniqueId: function() {
            this.idCounter += 1;
            return this.idCounter;
        },

        resetGlobalCounters: function() {
            Object.keys(GameCreator.globalObjects).forEach(function(key) {
                if (GameCreator.globalObjects[key].counters) {
                    Object.keys(GameCreator.globalObjects[key].counters).forEach(function(counterKey) {
                        GameCreator.globalObjects[key].counters[counterKey].reset();
                    });
                }
            });
        },

        resetGlobalObjects: function() {
            var objectNames = Object.keys(GameCreator.globalObjects);
            objectNames.forEach(function(objectName) {
                GameCreator.globalObjects[objectName].currentState = 0;
            })
        },

        playGame: function() {
            GameCreator.playScene(GameCreator.scenes[0]);
        },

        resetKeys: function() {
            GameCreator.keys.keyLeftPressed = false;
            GameCreator.keys.keyRightPressed = false;
            GameCreator.keys.keyUpPressed = false;
            GameCreator.keys.keyDownPressed = false;
            GameCreator.keys.pendingRelease = {};
            var keys = Object.keys(GameCreator.keys.keyPressed);
            keys.forEach(function(key) {
                GameCreator.keys.keyPressed[key] = false;
                GameCreator.keys.pendingRelease[key] = false;
            });
        },

        initializeKeyListeners: function() {
            GameCreator.resetKeys();
            $(GameCreator.mainCanvas).on("keydown.gameKeyListener", function(e) {
                switch (e.which) {
                    case 16:
                        GameCreator.keys.keyPressed.shift = true;
                        break;
                    case 17:
                        GameCreator.keys.keyPressed.ctrl = true;
                        break;
                    case 18:
                        GameCreator.keys.keyPressed.alt = true;
                        break;
                    case 32:
                        GameCreator.keys.keyPressed.space = true;
                        break;
                    case 65:
                    case 37:
                        GameCreator.keys.keyLeftPressed = true;
                        break;
                    case 87:
                    case 38:
                        GameCreator.keys.keyUpPressed = true;
                        break;
                    case 68:
                    case 39:
                        GameCreator.keys.keyRightPressed = true;
                        break;
                    case 83:
                    case 40:
                        GameCreator.keys.keyDownPressed = true;
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            });
            $(GameCreator.mainCanvas).on("keyup.gameKeyListener", function(e) {
                switch (e.which) {
                    case 16:
                        GameCreator.keys.keyPressed.shift = false;
                        break;
                    case 17:
                        GameCreator.keys.keyPressed.ctrl = false;
                        break;
                    case 18:
                        GameCreator.keys.keyPressed.alt = false;
                        break;
                    case 32:
                        GameCreator.keys.keyPressed.space = false;
                        break;
                    case 65:
                    case 37:
                        GameCreator.keys.keyPressed.left = false;
                        break;
                    case 87:
                    case 38:
                        GameCreator.keys.keyPressed.up = false;
                        break;
                    case 68:
                    case 39:
                        GameCreator.keys.keyPressed.right = false;
                        break;
                    case 83:
                    case 40:
                        GameCreator.keys.keyPressed.down = false;
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            });
            $(GameCreator.mainCanvas).on("mousedown.gameKeyListener", function(e) {
                switch (e.which) {
                    case 1:
                        GameCreator.keys.keyPressed.leftMouse = true;
                        break;
                    case 3:
                        GameCreator.keys.keyPressed.rightMouse = true;
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            });
            $(GameCreator.mainCanvas).on("mouseup.gameKeyListener", function(e) {
                switch (e.which) {
                    case 1:
                        GameCreator.keys.pendingRelease.leftMouse = true;
                        break;
                    case 3:
                        GameCreator.keys.pendingRelease.rightMouse = true;
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            });
        },

    };
    
}());
