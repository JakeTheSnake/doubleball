var GCHeight = 600;
var GCWidth = 800;

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
    addObjFunctions: {},
    helperFunctions: {},
    //The currently selected scene object.
    selectedObject: undefined,
    selectedGlobalObject: undefined,
    draggedObject: undefined,
    draggedNode: undefined,
    idCounter: 0,
    borderObjects: {
        borderL: {name: "borderL", x: -500, y: -500, height: GCHeight + 1000, width: 500, image: function(){var img = (new Image()); $(img).css("width","65"); img.src = "images/zergling.png"; return img}(), isCollidable: true},
        borderR: {name: "borderR", x: GCWidth, y: -500, height: GCHeight + 1000, width: 500, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "images/zergling.png"; return img}(), isCollidable: true},
        borderT: {name: "borderT", x: -500, y: -500, height: 500, width: GCWidth + 1000, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "images/zergling.png"; return img}(), isCollidable: true},
        borderB: {name: "borderB", x: -500, y: GCHeight, height: 500, width: GCWidth + 1000, image: function(){var img = (new Image()); $(img).css("width","65");img.src = "images/zergling.png"; return img}(), isCollidable: true}
    },
    
    reset: function() {
        clearInterval(GameCreator.timer);
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
    
    createInstance: function(globalObj, scene, args){
        var obj = Object.create(GameCreator.sceneObject);
        obj.instantiate(globalObj, args);
        scene.push(obj);
        return obj;
    },
    
    createRuntimeObject: function(globalObj, args){
        var obj = Object.create(GameCreator.sceneObject);
        obj.instantiate(globalObj, args);
        GameCreator.addToRuntime(obj);
    },
    
    runFrame: function(modifier){
        var obj;
        if(!GameCreator.paused){
            for (var i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    obj = GameCreator.movableObjects[i];
                    obj.parent.calculateSpeed.call(obj, modifier/1000);
                }
            }
            for (var i=0;i < GameCreator.collidableObjects.length;++i) {
                GameCreator.helperFunctions.checkCollisions(GameCreator.collidableObjects[i]);
            }
            for (var i=0;i < GameCreator.objectsToDestroy.length;++i)
            {
                obj = GameCreator.objectsToDestroy[i];
                obj.parent.destroy.call(obj);
            }
            GameCreator.objectsToDestroy.length = 0;
            for (var i=0;i < GameCreator.movableObjects.length;++i) {
                if(!GameCreator.paused)
                {
                    obj = GameCreator.movableObjects[i];
                    obj.parent.move.call(obj, modifier/1000);
                }
            }
            for (var i=0;i < GameCreator.eventableObjects.length;++i) {
                obj = GameCreator.eventableObjects[i];
                obj.parent.checkEvents.call(obj);
            }
            GameCreator.timerHandler.update(modifier);
        }
    },

    findClickedObject: function(x, y) {
        for (var i=0;i < GameCreator.renderableObjects.length;++i) {
            var obj = GameCreator.renderableObjects[i];
            // If in edit mode, this should look for displayWidth instead.
            if(x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height)
            {
                obj.clickOffsetX = x - obj.x;
                obj.clickOffsetY = y - obj.y;
                return obj;
            }
        }
        return null;
    },

    playScene: function(scene) {
        GameCreator.reset();
        //Populate the runtime arrays with clones of objects from this scene array. How do we make sure the right object ends up in the right arrays?
        //Do we need a new type of object? runtimeObject?
        for (var i=0;i < scene.length;++i) {
            var obj = jQuery.extend({}, scene[i]);
            GameCreator.addToRuntime(obj);
        }

        then = Date.now();
        GameCreator.resumeGame();
        
        if(GameCreator.state = 'editing') {
        	GameCreator.stopEditing();
        }
        
        GameCreator.sceneStarted();
        
        GameCreator.state = 'playing';
        GameCreator.timer = setInterval(this.gameLoop, 1);
    },

    gameLoop: function () {
        var now = Date.now();
        var delta = now - then;
    
        GameCreator.runFrame(delta);
        GameCreator.render();
    
        then = now;
    },

    pauseGame: function()
    {
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

    resumeGame: function()
    {
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
    
    addToRuntime: function(obj){
        if(obj.parent.isCollidable)
            GameCreator.collidableObjects.push(obj);
        if(obj.parent.isMovable)
            GameCreator.movableObjects.push(obj);
        if(obj.parent.isRenderable)
            GameCreator.renderableObjects.push(obj);
        if(obj.parent.isEventable)
            GameCreator.eventableObjects.push(obj);
        obj.parent.initialize.call(obj);
    },
    
    getUniqueId: function() {
        this.idCounter++;
        return this.idCounter;
    },
    
    sceneStarted: function(){
    	$(GameCreator.canvas).on("mousedown.runningScene", function(e){
        	var obj = GameCreator.findClickedObject(e.pageX - $("#mainCanvas").offset().left , e.pageY - $("#mainCanvas").offset().top);
        	if(obj && obj.parent.isClickable) {
	        	if(obj.parent.onClickActions.length <= 0)
	            {
	                GameCreator.UI.openEditActionsWindow(
	                    "Clicked on " + obj.parent.name,
	                     $.extend(GameCreator.actions.commonSelectableActions, GameCreator.actions.generalSelectableActions),
	                     obj.parent.onClickActions
	                    );
	            }
	            else
	            {
	                for(var i = 0;i < obj.parent.onClickActions.length;++i)
	                {
	                    obj.parent.onClickActions[i].action.call(obj, obj.parent.onClickActions[i].parameters);
	                }
	            }
	        }
        });
    },
    
}
