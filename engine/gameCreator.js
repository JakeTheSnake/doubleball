var GCHeight = 600;
var GCWidth = 800;

var GameCreator = {
	height: GCHeight,
	width: GCWidth,
	paused: false,
	//State can be 'editing', 'directing' or 'playing'. 
	state: 'editing',
	then: undefined,
	draggedGlobalElement: undefined,
	context: undefined,
	canvasOffsetX: 100,
	canvasOffsetY: 0,
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
	draggedObject: undefined,
	idCounter: 0,
	htmlStrings: {
		singleSelector: function(collection, elementId) {
			if(elementId == undefined)
				elementId = "actionSelector"
			var result = "<div><select id='" + elementId + "'>";
			for (key in collection) {
				if (collection.hasOwnProperty(key)) {
					result += "<option value='" + GameCreator.helperFunctions.toString(collection[key]) + "'>" + key + "</option>";
				}
			};
			result += "</select></div>";
			return result;
		},
		inputLabel: function(inputId, labelText) {
			return "<label for=" + inputId + ">" + labelText + "</label>";
		},
		actionRow: function(name, action) {
			var result = "<div>" + name + " ";
			for (key in action.parameters) {
				if (action.parameters.hasOwnProperty(key)) {
					result += key + ": " + action.parameters[key];
				}
			}
			result += "</div>";
			return result;
		},
		globalObjectElement: function(object) {
			var image = object.image;
			$(image).css("width","90");
			var span = $(document.createElement("span")).append(object.name);
			var div = $(document.createElement("div")).append(span).append(image);
			$(div).attr("id", "globalObjectElement_" + object.name);
			$(div).css("border-bottom","solid 1px");
			return div;
		},
		editActiveObjectForm: function(object) {
			var result = "<div>";
			result += "<label for='editActiveObjectHeight'>Height:</label><input id='editActiveObjectHeight' type='text' data-type='number' data-attrName='height'></input>"
			result += "<label for='editActiveObjectWidth'>Width:</label><input id='editActiveObjectWidth' type='text' data-type='number' data-attrName='width'></input>"
			if (object.parent.movementType == "free") {
				result += "<label for='editActiveObjectSpeedX'>SpeedX:</label><input id='editActiveObjectSpeedX' type='text' data-type='number' data-attrName='speedX'></input>"
				result += "<label for='editActiveObjectSpeedY'>SpeedY:</label><input id='editActiveObjectSpeedY' type='text' data-type='number' data-attrName='speedY'></input>"
			}
			else if(object.parent.movementType == "route") {
				result += "<label for='editActiveObjectRouteSpeed'>Speed:</label><input id='editActiveObjectRouteSpeed' type='text' data-type='number' data-attrName='routeSpeed'></input>"
				result += "<a href='' onclick='GameCreator.editRoute(GameCreator.selectedObject);return false;'>Edit route</a>"
			}
			return result + "<button id='saveSceneObjectButton' onClick='GameCreator.saveSceneObjectChanges()'>Save</button></div>";
		},
		routePoint: function(point, index) {
			var result = "<div class='routePoint' style='top:" + (point.y + GameCreator.canvasOffsetY) + "px;left:" + (point.x + GameCreator.canvasOffsetX) + "px;'>";
			result += "<span>" + (index + 1) + "</span></div>"
			return result;
		}
	},
	collideBorderLObject: {x: -500, y: -500, height: GCHeight + 1000, width: 500},
	collideBorderRObject: {x: GCWidth, y: -500, height: GCHeight + 1000, width: 500},
	collideBorderTObject: {x: -500, y: -500, height: 500, width: GCWidth + 1000},
	collideBorderBObject: {x: -500, y: GCHeight, height: 500, width: GCWidth + 1000},
	
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
		return obj;
	},
	
	createRuntimeObject: function(globalObj, args){
		var obj = Object.create(GameCreator.sceneObject);
		obj.instantiate(globalObj, args);
		GameCreator.addToRuntime(obj);
	},
	
	collisionSelectableActions: {"Bounce": {	action: function(params) {this.parent.bounce.call(this, params)},
												params: [],
												name: "Bounce"
											},
								 "Stop": 	{ 	action: function(params) {this.parent.stop.call(this, params)},
								 				params: [],
								 				name: "Stop"
							 				},
	},
	
	generalSelectableActions: {	"Stop":		{	action: function(params){this.parent.stop.call(this)},
			  									params: [],
			  									name: "Stop"
			  								}
	},
	
	commonSelectableActions: {	"Destroy": { 	action: function(params) {this.parent.destroy.call(this, params)},
								 				params: [],
								 				name: "Destroy"	
							 				},
								"Shoot": 	{ 	action: function(params) {this.parent.shoot.call(this, params)},
								 				params: [{	inputId: "objectToShoot",
								 							input: function() {return GameCreator.htmlStrings.singleSelector(GameCreator.globalObjects, "objectToShoot")},
								 							label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object to Shoot")}
								 						}],
								 				name: "Shoot"
				  							},
				  				"Nothing": 	{	action: function(params){},
				  								params: [],
				  								name: "Nothing"
			  								},
		},

	addActiveObject: function(args){
		var image = new Image();
		image.src = args.src;
		var activeObj = GameCreator.activeObject.New(image, args);
		GameCreator.createGlobalListElement(activeObj);
		image.onload = function() {
			activeObj.imageReady = true;
			GameCreator.render();
		};
		return activeObj;
	},
	
	addPlayerMouseObject: function(args){
		var image = new Image();
		image.src = args.src;
		var mouseObj = this.mouseObject.New(image, args);
		GameCreator.createGlobalListElement(mouseObj);
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
		GameCreator.createGlobalListElement(platformObj);
		image.onload = function() {
			platformObj.imageReady = true;
			GameCreator.render();
		};
		return platformObj;
	},
	
	addPlayerTopDownObject: function(args){
		var image = new Image();
		image.src = args.src;
		var topDownObj = this.topDownObject.New(image, args);
		GameCreator.createGlobalListElement(topDownObj);
		image.onload = function() {
			topDownObj.imageReady = true;
			GameCreator.render();
		};
		return topDownObj;
	},
	
	runFrame: function(modifier){
		var obj;
		if(!GameCreator.paused){
			for (var i=0;i < GameCreator.movableObjects.length;++i) {
				if(!GameCreator.paused)
				{
					obj = GameCreator.movableObjects[i];
					obj.parent.calculateSpeed.call(obj, modifier);
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
		//Here we populate the renderableObjects only since the other find are unused for editing. Also we use the actual sceneObjects in the
		//renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
		for (var i=0;i < scene.length;++i) {
			var obj = scene[i];
			if(obj.parent.isRenderable) {
				GameCreator.renderableObjects.push(obj);
			}
		}
		
		$(GameCreator.canvas).on("mousedown", function(e){
			GameCreator.draggedObject = GameCreator.findClickedObject(e.pageX - $("#mainCanvas").offset().left , e.pageY - $("#mainCanvas").offset().top);
			GameCreator.selectedObject = GameCreator.draggedObject;
			if(GameCreator.selectedObject) {
				GameCreator.editSceneObject();
			}
		});
		
		$(GameCreator.canvas).on("mouseup", function(){
			GameCreator.draggedObject = undefined;
		});
		
		$(GameCreator.canvas).on("mousemove", function(e){
			if(GameCreator.draggedObject)
			{
				GameCreator.draggedObject.x = e.pageX - $("#mainCanvas").offset().left - GameCreator.draggedObject.clickOffsetX;
				GameCreator.draggedObject.y = e.pageY - $("#mainCanvas").offset().top - GameCreator.draggedObject.clickOffsetY;
				GameCreator.render();
			}
		});
		
		$(window).on("mousemove", function(e){
			var pic = GameCreator.draggedGlobalElement;
			if (pic) {
				$(pic).css("top", e.pageY - 45);
				$(pic).css("left", e.pageX - 45);
			}
			return false;
		});
		
		$(window).on("mouseup", function(e){
			var pic = GameCreator.draggedGlobalElement;
			if (!pic) {
				return;
			}
			$(pic).remove();
			var x = e.pageX;
			var y = e.pageY;
			var offsetX = $("#mainCanvas").offset().left;
			var offsetY = $("#mainCanvas").offset().top;
			if (x > offsetX	&& x < offsetX + GameCreator.width
				&& y > offsetY && y < offsetY + GameCreator.height) {
					var newInstance = GameCreator.createInstance(GameCreator.globalObjects[$(pic).attr("data-name")], GameCreator.scenes[0], {x:x-offsetX, y:y-offsetY});
					if(newInstance.parent.isRenderable) {
						GameCreator.renderableObjects.push(newInstance);
						GameCreator.render();
					}
			}
				
			GameCreator.draggedGlobalElement = undefined;
		});
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
	
	selectActions: function(obj1, obj2, selectedAction){
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
				obj1.parent.collisionActions.push({name: obj2.name, action: function(targetObject){this.parent.bounce.call(this, targetObject)}});
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
			if(obj2.name == "borderLeft" || obj2.name == "borderRight" || obj2.name == "borderTop" || obj2.name == "borderBottom")
				obj1.parent[functionToReplace] = function(){};
			else
				obj1.parent.collisionActions.push({name: obj2.name, action: function(){}});
		}
		GameCreator.resumeGame();
		window.hide();
		$("#saveActionsButton").off("click");
		return false;
	},
		

	openSelectActionsWindow: function(text, callback, actions){
		//Only select actions if GameCreator isn't already paused for action selection.
		if(!GameCreator.paused){
			GameCreator.pauseGame();
			GameCreator.openSelectActionsWindow.setAction = callback;
			//GameCreator.openSelectActionsWindow.params = params;
			GameCreator.openSelectActionsWindow.selectedActions = [];
			GameCreator.openSelectActionsWindow.selectableActions = actions;
			$("#selectActionsHeader").html(text);
			$("#selectActionParametersContainer").html("");
			$("#selectActionDropdownContainer").html(GameCreator.htmlStrings.singleSelector(actions));
			$("#selectActionWindow").dialog("open");
			$("#actionSelector").on("change", function(){
				$("#selectActionParametersContainer").html("");
				for(var i = 0;i < actions[$(this).val()].params.length;++i) {
					$("#selectActionParametersContainer").append(actions[$(this).val()].params[i].label())
					$("#selectActionParametersContainer").append(actions[$(this).val()].params[i].input());
				}
			});
			
		}
	},
	
	assignSelectedActions: function(actions) {
		GameCreator.openSelectActionsWindow.setAction(actions);
		GameCreator.resumeGame();
	},
	
	saveState: function() {
		var results = {globalObjects: {}, scenes: [], idCounter: 0};
		//TODO: Put this array somewhere more "configy"
		
		//Save global objects
		var attrsToCopy = ["accX", "accY", "speedX", "speedY", "collideBorderB", "collideBorderL", "collideBorderR", "collideBorderT", "collisionActions", "facing", "height", "width", "keyActions", "maxSpeed", "name", "objectType"];
		var objects = GameCreator.globalObjects;
		for (name in objects) {
			if (objects.hasOwnProperty(name)) {
				var oldObject = objects[name];
				var newObject = {};
				for (i in attrsToCopy) {
					var attribute = attrsToCopy[i]
					if(oldObject.hasOwnProperty(attribute))
						newObject[attribute] = oldObject[attribute];	
				}
				newObject.imageSrc = $(oldObject.image).attr("src");
				results.globalObjects[newObject.name] = newObject;
			}
		};
		
		//Save scenes
		for(var i = 0; i < GameCreator.scenes.length; i++){
			var scene = GameCreator.scenes[i]
			var newScene = [];
			for(var n = 0; n < scene.length; n++){
				var oldObject = scene[n];
				var newObject = jQuery.extend({}, oldObject);
				//Need to save the name of the global object parent rather than the reference so it can be JSONified.
				newObject.parent = parent.name;
				newObject.instantiate = undefined;
				newScene.push(newObject);
			}
			results.scenes.push(newScene);
		}
		
		results.idCounter = GameCreator.idCounter;
		
		return JSONfn.stringify(results);
	},
	
	restoreState: function(savedJson) {
		//Remove old state
		for (var i = 0; i < GameCreator.scenes.length; i++) {
			for(var n = 0; n < GameCreator.scenes[i].length; n++) {
				GameCreator.scenes[i][n].parent.destroy.call(GameCreator.scenes[i][n]);
			}
		}
		GameCreator.scenes = [];
		GameCreator.globalObjects = {};
		$("#globalObjectList").html("");
		//Load globalObjects
		var parsedSave = JSONfn.parse(savedJson);
		for (name in parsedSave.globalObjects) {
			if (parsedSave.globalObjects.hasOwnProperty(name)) {
				var object = parsedSave.globalObjects[name];
				var newObject = GameCreator[object.objectType].createFromSaved(object);
				GameCreator.createGlobalListElement(newObject);
			}
		}
		
		//Load scenes
		for (var i = 0; i < parsedSave.scenes.length; i++) {
			var newScene = [];
			var savedScene = parsedSave.scenes[i];
			for(var n = 0; n < savedScene.length; n++) {
				var object = savedScene[n];
				object.parent = GameCreator.globalObjects[object.name];
				newScene.push(object);
			}
			GameCreator.scenes.push(newScene);
		}
		
		GameCreator.idCounter = parsedSave.idCounter;
		
		GameCreator.editScene(GameCreator.scenes[0]);
	},
	
	getUniqueId: function() {
		this.idCounter++;
		return this.idCounter;
	},
	
	createGlobalListElement: function(object) {
		var listElement = GameCreator.htmlStrings.globalObjectElement(object);
		$("#globalObjectList").append(listElement);
		$(listElement).on("mousedown", function(e){
			var image = new Image();
			image.src = $(this).find("img").attr("src");
			$(image).attr("data-name", object.name);
			$(image).css("position", "absolute");
			$(image).css("top", e.pageY-45);
			$(image).css("left", e.pageX-45);
			$(image).css("width", "90px");
			$("body").append(image);
			GameCreator.draggedGlobalElement = image;
			return false;
		});
	},
	
	editSceneObject: function() {
		$("#editSceneObjectTitle").html(GameCreator.selectedObject.name)
		if(GameCreator.selectedObject.parent.objectType == "activeObject") {
			$("#editSceneObjectContent").html(GameCreator.htmlStrings.editActiveObjectForm(GameCreator.selectedObject));
		}
		else if(GameCreator.selectedObject.parent.objectType == "mouseObject") {
			"mouseobject!"
		}
		else if(GameCreator.selectedObject.parent.objectType == "platformObject") {
			"platformobject"
		}
		else if(GameCreator.selectedObject.parent.objectType == "topDownObject") {
			"TOPDOWNOBJECT"
		}
	},
	
	//Since all inputs are tagged with "data-attrName" and "data-type" we have this general function for saving all object types.
	saveSceneObjectChanges: function() {
		var inputs = $("#editSceneObjectContent input");
		var input;
		for(var i = 0; i < inputs.length; i++) {
			input = $(inputs[i]);
			if(input.attr("data-type") == "string" && input.val().length != 0) {
				GameCreator.selectedObject[input.attr("data-attrName")] = input.val();
			}
			else if(input.attr("data-type") == "number" && input.val().length != 0) {
				GameCreator.selectedObject[input.attr("data-attrName")] = parseFloat(input.val());
			}
		}
		GameCreator.render();
	},
	
	editRoute: function(obj) {
		GameCreator.drawRoute(obj.route);
	},
	
	drawRoute: function(route) {
		var point;
		for(var i = 0; i < route.length; i++) {
			point = route[i];
			$("body").append(GameCreator.htmlStrings.routePoint(point, i));
		}
	}
}