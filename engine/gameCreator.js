var GameCreator = {
	height: 600,
	width: 800,
	paused: false,
	//State can be 'editing', 'directing' or 'playing'. 
	state: 'editing',
	then: undefined,
	context: undefined,
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
	selectedObject: undefined,
	htmlStrings: {
		collisionSelector: "<div><select id='collisionSelector'><option value=''>Nothing</option><option value='bounce'>Bounce</option><option value='stop'>Stop</option><option value='destroy'>Destroy</option></select></div>",
		shootObjectSelector: "<div><input type=checkbox id='shootObjectCheckbox'/>Shoot object <input type=text placeholder='Name'/></div>"
	},
	
	reset: function() {
		this.collidableObjects = [];
		this.movableObjects = [];
		this.renderableObjects = [];
		this.objectsToDestroy = [];
	},
	
	createInstance: function(globalObj, scene, args){
		var obj = Object.create(GameCreator.sceneObject);
		obj.instantiate(globalObj, args);
		scene.push(obj);
	},
	
	createRuntimeObject: function(globalObj, args){
		var obj = Object.create(GameCreator.sceneObject);
		obj.instantiate(globalObj, args);
		GameCreator.addToRuntime(obj);
	},
	
	addActiveObject: function(args){
		console.log("adding active obj with args")
		console.log(args)
		var image = new Image();
		image.src = args.src;
		var activeObj = GameCreator.activeObject.New(image, args);
		image.onload = function() {
			activeObj.imageReady = true;
			GameCreator.render();
		};
		return activeObj;
	},
	
	addPlayerMouseObject: function(args){
		console.log("adding mouse obj with args")
		console.log(args)
		var image = new Image();
		image.src = args.src;
		var mouseObj = this.mouseObject.New(image, args);
		image.onload = function() {
			mouseObj.imageReady = true;
			GameCreator.render();
		};
		return mouseObj;
	},
	
	addPlayerPlatformObject: function(args){
		var image = new Image();
		image.src = args.src;
		var platformObj = this.platformObject.New(image, args);
		image.onload = function() {
			platformObj.imageReady = true;
			GameCreator.render();
		};
		return platformObj;
	},
	
	runFrame: function(modifier){
		var obj;
		if(!GameCreator.paused){
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
					obj.parent.move.call(obj, modifier);
				}
			}
			for (var i=0;i < GameCreator.eventableObjects.length;++i) {
				obj = GameCreator.eventableObjects[i];
				obj.parent.checkEvents.call(obj);
			}
		}
	},

	findClickedObject: function(x, y) {
		for (var i=0;i < GameCreator.renderableObjects.length;++i) {
			var obj = GameCreator.renderableObjects[i];
			if(x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height)
			{
				this.selectedObject = obj;
				obj.clickOffsetX = x - obj.x;
				obj.clickOffsetY = y - obj.y;
			}
		}
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
		GameCreator.state = 'playing';
		setInterval(this.gameLoop, 1);
	},

	directActiveScene: function(){
		this.directScene(GameCreator.scenes[GameCreator.activeScene]);
	},
	
	directScene: function(scene){
		GameCreator.reset();
		for (var i=0;i < scene.length;++i) {
			var obj = jQuery.extend({}, scene[i]);
			GameCreator.addToRuntime(obj);
		}
		
		then = Date.now();
		GameCreator.resumeGame();
		GameCreator.state = 'directing';
		setInterval(this.gameLoop, 1);
	},

	editScene: function(scene){
		GameCreator.reset();
		//Here we populate the renderableObjects only since the other arrays are unused for editing. Also we use the actual sceneObjects in the
		//renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
		for (var i=0;i < scene.length;++i) {
			var obj = scene[i];
			if(obj.parent.isRenderable)
				GameCreator.renderableObjects.push(obj);
		}
		
		$(GameCreator.canvas).on("mousedown", function(e){
			console.log("clicked")
			GameCreator.findClickedObject(e.pageX, e.pageY);
		});
		
		$(GameCreator.canvas).on("mouseup", function(){
			GameCreator.selectedObject = undefined;
		})
		
		$(GameCreator.canvas).on("mousemove", function(e){
			if(GameCreator.selectedObject)
			{
				GameCreator.selectedObject.x = e.pageX - GameCreator.selectedObject.clickOffsetX;
				GameCreator.selectedObject.y = e.pageY - GameCreator.selectedObject.clickOffsetY;
				GameCreator.render();
			}
		})
	},

	gameLoop: function () {
		var now = Date.now();
		var delta = now - then;
	
		GameCreator.runFrame(delta / 1000);
		GameCreator.render();
	
		then = now;
	},

	pauseGame: function()
	{
		GameCreator.paused = true;
		$(GameCreator.canvas).css("cursor", "default");
	},

	resumeGame: function()
	{
		GameCreator.paused = false;
		$(GameCreator.canvas).css("cursor", "none");
	},

	render: function () {
		this.context.clearRect(0, 0, GameCreator.width, GameCreator.height);
		for (var i=0;i < GameCreator.renderableObjects.length;++i) {
			var obj = GameCreator.renderableObjects[i];
			if (obj.parent.imageReady) {
				this.context.drawImage(obj.parent.image, obj.x, obj.y, obj.width, obj.height);
			}
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
	},

	selectActions: function(obj1, obj2, functionToReplace){
		//Only select actions if GameCreator isn't already paused for action selection.
		if(!GameCreator.paused){
			console.log("Selectactions for " + obj1.name + " with " + obj2.name);
			GameCreator.pauseGame();
			var window = $("#selectActionWindow");
			window.css("top", obj1.y + "");
			window.css("left", obj1.x + 150 + "");
			window.show();
			$("#selectActionsHeader").html(obj1.name + " collided with " + obj2.name);
			$("#selectActionsContent1").html(GameCreator.htmlStrings.collisionSelector);
			$("#saveActionsButton").on("click", function(){
				var selectedAction = $("#collisionSelector").val();
				if(selectedAction == 'stop')
				{
					if(obj2.name == "borderLeft")
					{	
						obj1.parent[functionToReplace] = function(){this.parent.stopX.call(this, false)};
					}
					else if(obj2.name == "borderRight")
					{
						obj1.parent[functionToReplace] = function(){this.parent.stopX.call(this, true)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1.parent[functionToReplace] = function(){this.parent.stopY.call(this, false)};
					}
					else if(obj2.name == "borderBottom")
					{	
						obj1.parent[functionToReplace] = function(){this.parent.stopY.call(this, true)};
					}
					else
					{
						obj1.collisionActions.push({name: obj2.name, action: function(){obj1.objStop(obj2)}});
					}
				}
				else if(selectedAction == 'bounce')
				{
					if(obj2.name == "borderLeft")
					{
						obj1.parent[functionToReplace] = function(){this.parent.bounceX.call(this, false);};
					}
					else if(obj2.name == "borderRight")
					{
						obj1.parent[functionToReplace] = function(){this.parent.bounceX.call(this, true)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1.parent[functionToReplace] = function(){this.parent.bounceY.call(this, false)};
					}
					else if(obj2.name == "borderBottom")
					{
						obj1.parent[functionToReplace] = function(){this.parent.bounceY.call(this, true)};
					}
					//Colliding with something else than an edge.
					else
					{
						obj1.parent.collisionActions.push({name: obj2.name, action: function(targetObject){this.parent.objBounce.call(this, targetObject)}});
					}
				}
				else if(selectedAction == 'destroy')
				{
					if(obj2.name == "borderLeft")
					{
						obj1.parent[functionToReplace] = function(){GameCreator.objectsToDestroy.push(this)};
					}
					else if(obj2.name == "borderRight")
					{
						obj1.parent[functionToReplace] = function(){GameCreator.objectsToDestroy.push(this)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1.parent[functionToReplace] = function(){GameCreator.objectsToDestroy.push(this)};
					}
					else if(obj2.name == "borderBottom")
					{
						obj1.parent[functionToReplace] = function(){GameCreator.objectsToDestroy.push(this)};
					}
					else
					{
						obj1.parent.collisionActions.push({name: obj2.name, action: function(){GameCreator.objectsToDestroy.push(this)}});
					}
				}
				else
				{
					console.log("set to nothing")
					if(obj2.name == "borderLeft" || obj2.name == "borderRight" || obj2.name == "borderTop" || obj2.name == "borderBottom")
						obj1.parent[functionToReplace] = function(){};
					else
						obj1.parent.collisionActions.push({name: obj2.name, action: function(){}});
				}
				GameCreator.resumeGame();
				window.hide();
				$("#saveActionsButton").off("click");
				return false;
			});
		}
	}
}