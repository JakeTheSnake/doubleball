var GCHeight = 768;
var GCWidth = 1024;

var GameCreator = {
    height: GCHeight,
    width: GCWidth,
    paused: false,
    //State can be 'editing', 'directing' or 'playing'. 
    state: 'editing',
    then: undefined,
    timer: undefined,
    draggedGlobalElement: undefined,
    context: undefined,
    canvasOffsetX: 110,
    canvasOffsetY: 10,
    //Contains key value pairs where key is the (unique)name of the object.
    globalObjects: {},
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

    addObjFunctions: {},
    helperFunctions: {},
    //The currently selected scene object.
    selectedObject: undefined,
    draggedObject: undefined,
    draggedNode: undefined,
    idCounter: 0,
    borderObjects: {
        borderL: {name: "borderL", x: -500, y: -500, height: GCHeight + 1000, width: 500, image: function(){var img = (new Image()); $(img).css("width","65"); img.src = "assets/borderLeft.png"; return img}(), isCollidable: true},
        borderR: {name: "borderR", x: GCWidth, y: -500, height: GCHeight + 1000, width: 500, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "assets/borderRight.png"; return img}(), isCollidable: true},
        borderT: {name: "borderT", x: -500, y: -500, height: 500, width: GCWidth + 1000, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "assets/borderTop.png"; return img}(), isCollidable: true},
        borderB: {name: "borderB", x: -500, y: GCHeight, height: 500, width: GCWidth + 1000, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "assets/borderBottom.png"; return img}(), isCollidable: true}
    },
    gameLoop: function () {
        var now = Date.now();
        var delta = now - then;
    
        GameCreator.runFrame(delta);
        GameCreator.render();
    
        then = now;
    },

    runFrame: function(modifier){
        var runtimeObj;
        if(!GameCreator.paused){
            for (var i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.calculateSpeed.call(runtimeObj, modifier/1000);
                }
            }
            for (i=0;i < GameCreator.collidableObjects.length;++i) {
                GameCreator.helperFunctions.checkCollisions(GameCreator.collidableObjects[i]);
            }
            for (i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.move.call(runtimeObj, modifier/1000);
                }
            }
            for (i=0;i < GameCreator.eventableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.eventableObjects[i];
                    runtimeObj.parent.checkEvents.call(runtimeObj);
                }
            }
            GameCreator.timerHandler.update(modifier);
            for (i=0;i < GameCreator.objectsToDestroy.length;++i)
            {
                runtimeObj = GameCreator.objectsToDestroy[i];
                runtimeObj.parent.removeFromGame.call(runtimeObj);
            }
            for (i=0;i < GameCreator.newlyCreatedObjects.length;++i)
            {
                runtimeObj = GameCreator.newlyCreatedObjects[i];
                runtimeObj.parent.onCreate.call(runtimeObj);
            }
            GameCreator.newlyCreatedObjects = [];
        }
    },

    reset: function() {
        clearInterval(GameCreator.timer);
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
        $(GameCreator.canvas).off("mousedown.runningScene");
        $(GameCreator.canvas).css("cursor", "default");
    },
    
    

    pauseGame: function() {
        GameCreator.paused = true;
        $(document).off("keydown.gameKeyListener");
        $(document).off("keyup.gameKeyListener");
        $(document).off("mousemove.gameKeyListener");
        $(document).off("mousedown.gameKeyListener");
        $(document).off("mouseup.gameKeyListener");
        $(GameCreator.canvas).css("cursor", "default");
        
        //Set all keypresses to false here since we turn off keyUp.
        for(objectName in GameCreator.globalObjects) {
            if(GameCreator.globalObjects.hasOwnProperty(objectName)) {
                var obj = GameCreator.globalObjects[objectName];
                if(obj.keyPressed) {
                    for(keyName in obj.keyPressed) {
                        if(obj.keyPressed.hasOwnProperty(keyName)) {
                            obj.keyPressed[keyName] = false;
                            if(obj.keyUpPressed)
                                obj.keyUpPressed = false;
                            if(obj.keyDownPressed)
                                obj.keyDownPressed = false;
                            if(obj.keyLeftPressed)
                                obj.keyLeftPressed = false;
                            if(obj.keyRightPressed)
                                obj.keyRightPressed = false;
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
        GameCreator.paused = false;
        var activeScene = GameCreator.scenes[GameCreator.activeScene];
        for (var i=0;i < activeScene.length;++i) {
            activeScene[i].parent.onGameStarted();
        }
    },

    render: function () {
        this.context.clearRect(0, 0, GameCreator.width, GameCreator.height);
        for (var i=0;i < GameCreator.renderableObjects.length;++i) {
            var obj = GameCreator.renderableObjects[i];
            if (obj.parent.imageReady) {
                if (Array.isArray(obj.width) || Array.isArray(obj.height)) {
                    var maxHeight;
                    var minHeight;
                    var maxWidth;
                    var minWidth;
                    if (obj.width.length === 2) {
                        maxWidth = obj.width[1];
                        minWidth = obj.width[0];
                    } else if (obj.width.length === 1) {
                        maxWidth = obj.width[0];
                        minWidth = obj.width[0];
                    } else {
                        maxWidth = obj.width;
                        minWidth = obj.width;
                    }
                    if (obj.height.length === 2) {
                        maxHeight = obj.height[1];
                        minHeight = obj.height[0];
                    } else if (obj.height.length === 1) {
                        maxHeight = obj.height[0];
                        minHeight = obj.height[0];
                    } else {
                        maxHeight = obj.height;
                        minHeight = obj.height;
                    }
                    this.context.globalAlpha = 0.5;
                    this.context.drawImage(obj.parent.image, obj.x, obj.y, parseInt(maxWidth), parseInt(maxHeight));
                    this.context.globalAlpha = 1.0;
                    this.context.drawImage(obj.parent.image, obj.x, obj.y, parseInt(minWidth), parseInt(minHeight));
                }
                else {
                    this.context.drawImage(obj.parent.image, obj.x, obj.y, obj.width, obj.height);
                }
            }
        }
        if(this.selectedObject) {
            var selobj = this.selectedObject;
            this.context.beginPath();
            this.context.moveTo(selobj.x, selobj.y);
            this.context.lineTo(selobj.x + selobj.displayWidth, selobj.y);
            this.context.lineTo(selobj.x + selobj.displayWidth, selobj.y + selobj.displayHeight);
            this.context.lineTo(selobj.x, selobj.y + selobj.displayHeight);
            this.context.closePath();
            this.context.stroke();
        }

    },

    

    createRuntimeObject: function(globalObj, args){
        var runtimeObj = Object.create(GameCreator.sceneObject);
        if (globalObj.hasOwnProperty("objectToCreate")) {
            args.x = globalObj.x
            args.y = globalObj.y
            globalObj = GameCreator.globalObjects[globalObj.objectToCreate];
        }
        runtimeObj.instantiate(globalObj, args);
        GameCreator.addToRuntime(runtimeObj);
    },

    addToRuntime: function(runtimeObj){
        if(runtimeObj.parent.isCollidable)
            GameCreator.collidableObjects.push(runtimeObj);
        if(runtimeObj.parent.isMovable)
            GameCreator.movableObjects.push(runtimeObj);
        if(runtimeObj.parent.isRenderable)
            GameCreator.renderableObjects.push(runtimeObj);
        if(runtimeObj.parent.isEventable)
            GameCreator.eventableObjects.push(runtimeObj);
        runtimeObj.parent.initialize.call(runtimeObj);
        GameCreator.newlyCreatedObjects.push(runtimeObj);
    },

    getGlobalObjects: function() {
        var allGlobalObjects = {};
        for(globalObj in GameCreator.globalObjects) {
            if(GameCreator.globalObjects.hasOwnProperty(globalObj)) {
                allGlobalObjects[globalObj] = globalObj;
            }
        }
        return allGlobalObjects;
    },
    
    
    
    getCountersForGlobalObj: function(globalObjName) {
    	var obj;
    	GameCreator.globalObjects[globalObjName];
    	if (GameCreator.globalObjects.hasOwnProperty(globalObjName)) {
			obj = GameCreator.globalObjects[globalObjName];
    	} else {
    		obj = GameCreator.getSceneObjectById(globalObjName).parent;
    	}
    	var result = {};
    	for (var counter in obj.counters) {
    		if (obj.counters.hasOwnProperty(counter)) {
    			result[counter] = counter;
    		}
    	}
    	return result;
    },
    
    changeCounter: function(runtimeObj, params) {
    	var selectedObjectId = params.counterObject;
    	if (runtimeObj.name != selectedObjectId) {
    		runtimeObj = GameCreator.getSceneObjectById(selectedObjectId);
    	}
    	if (params.counterType === "set") {
    		runtimeObj.counters[params.counterName].setValue(params.counterValue);
    	} else {
    		runtimeObj.counters[params.counterName].changeValue(params.counterValue);	
    	}
    	
    },
    


    getClickedObject: function(x, y) {
        for (var i = GameCreator.renderableObjects.length - 1;i >= 0;--i) {
            var runtimeObj = GameCreator.renderableObjects[i];
            // If in edit mode, this should look for displayWidth instead.
            if(x >= runtimeObj.x &&
                x <= runtimeObj.x + runtimeObj.width &&
                y >= runtimeObj.y &&
                y <= runtimeObj.y + runtimeObj.height)
            {
                runtimeObj.clickOffsetX = x - runtimeObj.x;
                runtimeObj.clickOffsetY = y - runtimeObj.y;
                return runtimeObj;
            }
        }
        return null;
    },

    getRuntimeObject: function(instanceId) {
        var collidableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.collidableObjects, instanceId);
        if (collidableObj) {
            return collidableObj;
        }
        var movableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.movableObjects, instanceId);
        if (movableObj) {
            return movableObj;
        }
        var renderableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.renderableObjects, instanceId);
        if (renderableObj) {
            return renderableObj;
        }
        var eventableObj = GameCreator.getRuntimeObjectFromCollection(GameCreator.eventableObjects, instanceId);
        if (eventableObj) {
            return eventableObj;
        }
        return null;
    },


    getRuntimeObjectFromCollection: function(collection, instanceId) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i].instanceId === instanceId) {
                return collection[i];
            }
        }
    },

    getUniqueId: function() {
        this.idCounter++;
        return this.idCounter;
    }
    
}
