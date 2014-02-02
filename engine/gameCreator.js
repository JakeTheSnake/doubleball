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
    collidableObjects: {},
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
        GameCreator.render(false);
        if (GameCreator.state !== 'editing') {
            requestAnimationFrame(GameCreator.gameLoop);
        }
        then = now;
    },

    runFrame: function(deltaTime){
        var runtimeObj;
        if(!GameCreator.paused){
            for (var i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.calculateSpeed.call(runtimeObj, deltaTime/1000);
                }
            }
            for (var objectName in GameCreator.collidableObjects) {
                if (GameCreator.collidableObjects.hasOwnProperty(objectName)) {
                    for (var i = 0; i < GameCreator.collidableObjects[objectName].length; i++) {
                        runtimeObj = GameCreator.collidableObjects[objectName][i];
                        GameCreator.helperFunctions.checkCollisions(runtimeObj);
                    }
                }
            }
            for (i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.movableObjects[i];
                    runtimeObj.parent.move.call(runtimeObj, deltaTime/1000);
                }
            }
            for (i=0;i < GameCreator.eventableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    runtimeObj = GameCreator.eventableObjects[i];
                    runtimeObj.parent.checkEvents.call(runtimeObj);
                }
            }
            GameCreator.timerHandler.update(deltaTime);
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
            GameCreator.debug.calculateDebugInfo(deltaTime);
        }
    },

    invalidate: function(obj) {
        var x = parseInt(obj.x);
        var y = parseInt(obj.y);
        var xCorr = 0;
        var yCorr = 0;
        var width = GameCreator.helperFunctions.getRandomFromRange(obj.width);
        var height = GameCreator.helperFunctions.getRandomFromRange(obj.height);
        if (obj.x < 0) {
            xCorr = x;
            x = 0;
        }
        if (obj.y < 0) {
            yCorr = y;
            y = 0;
        }
        //console.log("clearRect: x1=" + x + ", y1=" + y + ", x2=" + (width + xCorr) + ", y2=" + (height + yCorr));
        this.mainContext.clearRect(x, y,
            width + xCorr + 1,
            height + yCorr + 1);
        obj.invalidated = true;
    },

    reset: function() {
        clearInterval(GameCreator.timer);
        GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
        GameCreator.mainContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
        GameCreator.bgContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
        GameCreator.timerHandler.clear();
        this.collidableObjects = {};
        this.movableObjects = [];
        this.renderableObjects = [];
        this.objectsToDestroy = [];
        this.eventableObjects = [];
        $(document).off("keydown.gameKeyListener");
        $(document).off("keyup.gameKeyListener");
        $(document).off("mousemove.gameKeyListener");
        $(document).off("mousedown.gameKeyListener");
        $(document).off("mouseup.gameKeyListener");
        $(GameCreator.mainCanvas).off("mousedown.runningScene");
        $(GameCreator.mainCanvas).css("cursor", "default");
    },
    
    

    pauseGame: function() {
        GameCreator.paused = true;
        $(document).off("keydown.gameKeyListener");
        $(document).off("keyup.gameKeyListener");
        $(document).off("mousemove.gameKeyListener");
        $(document).off("mousedown.gameKeyListener");
        $(document).off("mouseup.gameKeyListener");
        $(GameCreator.mainCanvas).css("cursor", "default");
        
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

    render: function (forceRender) {
        for (var i=0;i < GameCreator.renderableObjects.length;++i) {
            var obj = GameCreator.renderableObjects[i];
            if (true || obj.invalidated || forceRender) { // TODO: Deactivated invalidation
                obj.parent.draw(this.mainContext, obj);
            }
        }
        GameCreator.drawSelectionLine();
    },

    createRuntimeObject: function(globalObj, args){
        var runtimeObj = Object.create(GameCreator.sceneObject);
        if (globalObj.hasOwnProperty("objectToCreate")) {
            args.x = globalObj.x
            args.y = globalObj.y
            globalObj = GameCreator.globalObjects[globalObj.objectToCreate];
        }
        runtimeObj.instantiate(globalObj, args);
        runtimeObj.reset();
        GameCreator.addToRuntime(runtimeObj);
    },

    addToRuntime: function(runtimeObj){
        if(runtimeObj.parent.isCollidable) {
            if (!GameCreator.collidableObjects[runtimeObj.parent.name]) {
                GameCreator.collidableObjects[runtimeObj.parent.name] = [];
            }
            GameCreator.collidableObjects[runtimeObj.parent.name].push(runtimeObj);
        }
        if(runtimeObj.parent.isMovable) {
            GameCreator.movableObjects.push(runtimeObj);
        }
        if(runtimeObj.parent.isRenderable) {
            GameCreator.renderableObjects.push(runtimeObj);
        }
        if(runtimeObj.parent.isEventable) {
            GameCreator.eventableObjects.push(runtimeObj);
        }
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
    	if (GameCreator.globalObjects.hasOwnProperty(globalObjName)) {
			obj = GameCreator.globalObjects[globalObjName];
    	} else {
    		var tmpObj = GameCreator.getSceneObjectById(globalObjName);
    		obj = tmpObj ? tmpObj.parent : null;
    	}
    	var result = {};
    	if(obj){
	    	for (var counter in obj.counters) {
	    		if (obj.counters.hasOwnProperty(counter)) {
	    			result[counter] = counter;
	    		}
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
    },

    playGame: function() {
        GameCreator.playScene(GameCreator.scenes[0]);
    }
    
}
