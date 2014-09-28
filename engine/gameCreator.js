/*global GameCreator, $, Image, window, requestAnimationFrame, document*/
(function() {
    "use strict";
    var GCHeight = 768;
    var GCWidth = 1024;

    window.GameCreator = {
        height: GCHeight,
        width: GCWidth,
        paused: false,
        state: 'editing', //State can be editing, directing or playing. 
        then: undefined, // The time before last frame
        draggedGlobalElement: undefined,
        canvasOffsetX: 110,
        canvasOffsetY: 10,

        globalObjects: {}, //Contains key value pairs where key is the (unique)name of the object.

        //Scene contains all objects that initially exist in one scene. It is used as a blueprint to create the runtime arrays of objects.
        scenes: [],
        activeScene: 0,

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

        selectedObject: undefined, //The currently selected scene object.
        hoveredObject: undefined,
        draggedNode: undefined,
        idCounter: 0, // Counter used for scene objects' instance IDs
        globalIdCounter: 0, // Counter used for global objects ID

        gameLoop: function () {
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
            GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
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
            GameCreator.drawSelectionLine();
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
            GameCreator.debug.calculateDebugInfo(deltaTime);
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
                    GameCreator.helpers.checkCollisions(runtimeObjects[i]);
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
            GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
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
                GameCreator.directScene(GameCreator.scenes[0]);
            } else if (GameCreator.state === 'playing') {
                GameCreator.playScene(GameCreator.scenes[0]);
            }
        },
        resumeGame: function() {
            var i, activeScene;
            GameCreator.paused = false;
            activeScene = GameCreator.getActiveScene();
            for (i = 0; i < activeScene.objects.length; i += 1) {
                activeScene.objects[i].parent.onGameStarted();
            }
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
            var counterCarrier;
            if (selectedObjectId !== 'this') {
                runtimeObj = GameCreator.getSceneObjectById(selectedObjectId);
            }
            if (runtimeObj.parent.attributes.unique) {
                counterCarrier = runtimeObj.parent;
            } else {
                counterCarrier = runtimeObj;
            }
            if (params.counterType === 'set') {
                counterCarrier.counters[counterName].setValue(params.value);
            } else {
                counterCarrier.counters[counterName].changeValue(params.value);
            }
        },

        changeState: function(runtimeObj, params) {
            var selectedObjectId = params.objectId;
            if (selectedObjectId !== 'this') {
                runtimeObj = GameCreator.getSceneObjectById(selectedObjectId);
            }
            runtimeObj.setState(parseInt(params.stateId, 10));
        },
        
        getClickedObject: function(x, y) {
            var i, runtimeObj;
            for (i = GameCreator.renderableObjects.length - 1; i >= 0; i -= 1) {
                runtimeObj = GameCreator.renderableObjects[i];
                // If in edit mode, this should look for displayWidth instead.
                if (x >= runtimeObj.x &&
                    x <= runtimeObj.x + runtimeObj.width &&
                    y >= runtimeObj.y &&
                    y <= runtimeObj.y + runtimeObj.height && runtimeObj.parent.isClickable)
                {
                    runtimeObj.clickOffsetX = x - runtimeObj.x;
                    runtimeObj.clickOffsetY = y - runtimeObj.y;
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
                if (collection[i].instanceId === instanceId) {
                    return collection[i];
                }
            }
        },
        getUniqueId: function() {
            this.idCounter += 1;
            return this.idCounter;
        },
        playGame: function() {
            GameCreator.UI.hideEditModeTools();
            GameCreator.playScene(GameCreator.scenes[0]);
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
        borderObjects: {
            borderL: {
                objectName: "borderL", 
                parent: {id: -1}, 
                id: -1, 
                isCollidable: true,
                attributes: {
                    x: -500, 
                    y: -500, 
                    height: GCHeight + 1000, 
                    width: 500,
                    image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderLeft.png"; return img; }()),
                },
                image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderLeft.png"; return img; }()),
            },
            borderR: {
                objectName: "borderR", 
                parent: {id: -2}, 
                id: -2, 
                isCollidable: true,
                attributes: {
                    x: GCWidth, 
                    y: -500, 
                    height: GCHeight + 1000, 
                    width: 500, 
                    image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderRight.png"; return img; }()),
                },
                image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderRight.png"; return img; }()),
            },
            borderT: {
                objectName: "borderT", 
                parent: {id: -3}, 
                id: -3, 
                isCollidable: true,
                attributes: {
                    x: -500, 
                    y: -500, 
                    height: 500, 
                    width: GCWidth + 1000, 
                    image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderTop.png"; return img; }()),
                },
                image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderTop.png"; return img; }()),
            },
            borderB: {
                objectName: "borderB", 
                parent: {id: -4}, 
                id: -4, 
                isCollidable: true,
                attributes: {
                    x: -500, 
                    y: GCHeight, 
                    height: 500, 
                    width: GCWidth + 1000, 
                    image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderBottom.png"; return img; }()),
                },
                image: (function() {var img = (new Image()); $(img).css("width", "65"); img.src = "assets/borderBottom.png"; return img; }()),
            },
        },
    };

    var borderKeys = Object.keys(GameCreator.borderObjects);

    for (var i = 0; i < borderKeys.length; i += 1 ) {
        GameCreator.borderObjects[borderKeys[i]].getDefaultState = function() {
            return {attributes: this.attributes};
        };
    }

}());
