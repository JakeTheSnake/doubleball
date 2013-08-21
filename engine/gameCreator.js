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
	canvasOffsetX: 75,
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
	//The currently selected scene object.
	selectedObject: undefined,
	selectedGlobalObject: undefined,
	draggedObject: undefined,
	draggedNode: undefined,
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
			$(image).css("width","65");
			var span = $(document.createElement("span")).append(object.name);
			var div = $(document.createElement("div")).append(span).append(image);
			$(div).attr("id", "globalObjectElement_" + object.name);
			return div;
		},
		globalObjectEditButton: function(object) {
			var button = document.createElement("button");
			$(button).append("Edit");
			var div = $(document.createElement("div")).append(button);
			$(div).css("border-bottom","solid 1px");
			return div;
		},
		editActiveObjectForm: function(object) {
			var result = "<div class='editSceneObjectForm'>";
			result += "<label for='editActiveObjectHeight'>Height:</label><input id='editActiveObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
			result += "<label for='editActiveObjectWidth'>Width:</label><input id='editActiveObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
			if (object.parent.movementType == "free") {
				result += "<label for='editActiveObjectSpeedX'>SpeedX:</label><input id='editActiveObjectSpeedX' type='text' data-type='number' data-attrName='speedX' value='" + object.speedX + "'></input>";
				result += "<label for='editActiveObjectSpeedY'>SpeedY:</label><input id='editActiveObjectSpeedY' type='text' data-type='number' data-attrName='speedY' value='" + object.speedY + "'></input>";
				result += "<label for='editActiveObjectAccX'>AccX:</label><input id='editActiveObjectAccX' type='text' data-type='number' data-attrName='accX' value='" + object.accX + "'></input>";
				result += "<label for='editActiveObjectAccY'>AccY:</label><input id='editActiveObjectAccY' type='text' data-type='number' data-attrName='accY' value='" + object.accY + "'></input>";
			}
			else if(object.parent.movementType == "route") {
				result += "<label for='editActiveObjectRouteSpeed'>Speed:</label><input id='editActiveObjectRouteSpeed' type='text' data-type='number' data-attrName='routeSpeed' value='" + object.routeSpeed + "'></input>"
				result += "<label for='editActiveObjectStartNode'>Starting Node</label><select id='editActiveObjectStartNode' data-type='number' data-attrName='targetNode'>";
				for (var i = 0; i < object.route.length; i++) {
					result += "<option value='" + i + "'" + (object.targetNode == i ? 'selected' : '') + ">" + (i + 1) + "</option>";
				}
				result += "</select><br/>";
				result += "<label for='editActiveObjectRouteDirection'>Direction</label><select id='editActiveObjectRouteDirection' data-type='bool' data-attrName='routeForward'> \
					<option value='true'" + (object.routeForward ? 'selected' : '') + ">Forward</option><option value='false'" + (!object.routeForward ? 'selected' : '') + ">Backward</option></select>";
				result += "<a href='' onclick='GameCreator.drawRoute(GameCreator.selectedObject.route);return false;'>Edit route</a>";
			}
			return result + "<button id='saveSceneObjectButton' onClick='GameCreator.saveSceneObjectChanges()'>Save</button></div>";
		},
		editMouseObjectForm: function(object) {
			var result = "<div class='editSceneObjectForm'>";
			result += "<label for='editMouseObjectHeight'>Height:</label><input id='editMouseObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
			result += "<label for='editMouseObjectWidth'>Width:</label><input id='editMouseObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
			
			result += "<label for='editMouseObjectMinX'>Min X:</label><input id='editMouseObjectMinX' type='text' data-type='number' data-attrName='minX' value='" + object.minX + "'></input>";
			result += "<label for='editMouseObjectMinY'>Min Y:</label><input id='editMouseObjectMinY' type='text' data-type='number' data-attrName='minY' value='" + object.minY + "'></input>";
			
			result += "<label for='editMouseObjectMaxX'>Max X:</label><input id='editMouseObjectMaxX' type='text' data-type='number' data-attrName='maxX' value='" + object.maxX + "'></input>";
			result += "<label for='editMouseObjectMaxY'>Max Y:</label><input id='editMouseObjectMaxY' type='text' data-type='number' data-attrName='maxY' value='" + object.maxY + "'></input>";
			
			return result + "<button id='saveSceneObjectButton' onClick='GameCreator.saveSceneObjectChanges()'>Save</button></div>";
		},
		editPlatformObjectForm: function(object) {
			var result = "<div class='editSceneObjectForm'>";
			result += "<label for='editPlatformObjectHeight'>Height:</label><input id='editPlatformObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
			result += "<label for='editPlatformObjectWidth'>Width:</label><input id='editPlatformObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
			
			result += "<label for='editPlatformObjectAccY'>Gravity:</label><input id='editPlatformObjectAccY' type='text' data-type='number' data-attrName='accY' value='" + object.accY + "'></input>";
			
			result += "<label for='editPlatformObjectMaxSpeed'>Speed:</label><input id='editPlatformObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + object.maxSpeed + "'></input>";
			result += "<label for='editPlatformObjectAcceleration'>Acceleration:</label><input id='editPlatformObjectAcceleration' type='text' data-type='number' data-attrName='acceleration' value='" + object.acceleration + "'></input>";
			
			return result + "<button id='saveSceneObjectButton' onClick='GameCreator.saveSceneObjectChanges()'>Save</button></div>";
		},
		editTopDownObjectForm: function(object) {
			var result = "<div class='editSceneObjectForm'>";
			result += "<label for='editTopDownObjectHeight'>Height:</label><input id='editTopDownObjectHeight' type='text' data-type='number' data-attrName='height' value='" + object.height + "'></input>";
			result += "<label for='editTopDownObjectWidth'>Width:</label><input id='editTopDownObjectWidth' type='text' data-type='number' data-attrName='width' value='" + object.width + "'></input>";
			
			result += "<label for='editTopDownObjectMaxSpeed'>Speed:</label><input id='editTopDownObjectMaxSpeed' type='text' data-type='number' data-attrName='maxSpeed' value='" + object.maxSpeed + "'></input>";
			
			return result + "<button id='saveSceneObjectButton' onClick='GameCreator.saveSceneObjectChanges()'>Save</button></div>";
		},
		routeNode: function(node, index) {
			var result = "<div class='routeNodeContainer' style='position:absolute; top:" + (node.y + GameCreator.canvasOffsetY) + "px;left:" + (node.x + GameCreator.canvasOffsetX) + "px;'><div class='routeNode' data-index='" + index + "'> \
				<span class='routeNodeLabel'>" + (index + 1) + "</span></div> \
				<div class='nodeActions'><a href='' onclick='GameCreator.selectedObject.insertNode(" + index + "); return false;'>+</a>";
			if(index != 0) {	
				result += "<a href='' onclick='GameCreator.selectedObject.removeNode(" + index + "); return false;'>X</a></div></div>";
			}
			return result;
		},
		editGlobalObjectWindow: function(object) {
			result = "";
			//The tabs here should depend on the kind of object. For now we just show them all.
			result += "<div id='editGlobalObjectTabContainer'><div class='editGlobalObjectTab' data-htmlString='editGlobalObjectPropertiesContent'><span>Properties</span></div> \
			<div class='editGlobalObjectTab' data-htmlString='editGlobalObjectCollisionsContent'><span>Collisions<span></div> \
			<div class='editGlobalObjectTab' data-htmlString='editGlobalObjectKeyActionsContent'><span>Key Actions</span></div> \
			<div class='editGlobalObjectTab' data-htmlString='editGlobalObjectTimerActionsContent'><span>Timer Actions</span></div> \
			<div class='editGlobalObjectTab' data-htmlString='editGlobalObjectCounterActionsContent'><span>Counter Actions</span></div></div> \
			<div id='editGlobalObjectWindowContent'></div>";
			return result;
		},
		editGlobalObjectPropertiesContent: function(object) {
			var result = "";
			if(object.objectType == "activeObject") {
				result += "Active object"
			}
			else if(object.objectType == "mouseObject") {
				result += "mouseObject"
			}
			else if(object.objectType == "topDownObject") {
				result += "topDownObject"
			}
			else if(object.objectType == "platformObject") {
				result += "platformObject"
			}
			return result;
		},
		editGlobalObjectCollisionsContent: function(object) {
			result = "Collisions!";
			for (colName in object.collisionActions) {
				if (object.collisionActions.hasOwnProperty(colName)) {
					result += "<div><span data-objectName='" + object.name + "'>" + object.name + "</span></div>"
				}
			};
			return result;
		},
		editGlobalObjectKeyActionsContent: function(object) {
			return "KeyActions!";
		},
		editGlobalObjectTimerActionsContent: function(object) {
			return "Timer Actions";
		},
		editGlobalObjectCounterActionsContent: function(object) {
			return "Counter Actions";
		},
		freeMovementForm: function() {
			return '<label for="addObjectSpeedX">SpeedX:</label><input id="addObjectSpeedX" type="text"></input> \
					<label for="addObjectSpeedY">SpeedY:</label><input id="addObjectSpeedY" type="text"></input> \
					<label for="addObjectAccX">AccX:</label><input id="addObjectAccX" type="text"></input> \
					<label for="addObjectAccY">AccY:</label><input id="addObjectAccY" type="text"></input>';
		}
	},
	
	collideBorderLObject: {name: "borderL", x: -500, y: -500, height: GCHeight + 1000, width: 500},
	collideBorderRObject: {name: "borderR", x: GCWidth, y: -500, height: GCHeight + 1000, width: 500},
	collideBorderTObject: {name: "borderT", x: -500, y: -500, height: 500, width: GCWidth + 1000},
	collideBorderBObject: {name: "borderB", x: -500, y: GCHeight, height: 500, width: GCWidth + 1000},
	
	reset: function() {
		clearInterval(GameCreator.timer);
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
		GameCreator.timer = setInterval(this.gameLoop, 1);
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
		$(".routeNodeContainer").remove();
		$("#directSceneButton").hide();
		$("#editSceneButton").show();
		then = Date.now();
		GameCreator.resumeGame();
		GameCreator.state = 'directing';
		GameCreator.timer = setInterval(this.gameLoop, 1);
	},
	
	editActiveScene: function(){
		this.editScene(GameCreator.scenes[GameCreator.activeScene]);
	},

	editScene: function(scene){
		GameCreator.reset();
		$(GameCreator.canvas).css("cursor", "default");
		//Here we populate the renderableObjects only since the other find are unused for editing. Also we use the actual sceneObjects in the
		//renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
		for (var i=0;i < scene.length;++i) {
			var obj = scene[i];
			if(obj.parent.isRenderable) {
				GameCreator.renderableObjects.push(obj);
				GameCreator.render();
			}
		}
		
		$(window).on("mousemove", function(e) {
			if (GameCreator.draggedNode) {
				$(GameCreator.draggedNode).parent().css("top", e.pageY - 10);
				$(GameCreator.draggedNode).parent().css("left", e.pageX - 10);
				return false;
			}
		});
		
		$(window).on("mouseup", function(e) {
			if (GameCreator.draggedNode) {
				GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - GameCreator.canvasOffsetX - 10;
				GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - GameCreator.canvasOffsetY - 10;
				GameCreator.draggedNode = undefined;
				GameCreator.drawRoute(GameCreator.selectedObject.route);
				return false;
			}
		});
		
		$(GameCreator.canvas).on("mousedown", function(e){
			GameCreator.draggedObject = GameCreator.findClickedObject(e.pageX - $("#mainCanvas").offset().left , e.pageY - $("#mainCanvas").offset().top);
			if(GameCreator.draggedObject) {
				GameCreator.selectedObject = GameCreator.draggedObject;
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
		
		$("#directSceneButton").show();
		$("#editSceneButton").hide();
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
		
	/**
	 * Opens a window where the user can select Actions for the current Event.
	 * text: The text that should be show as description of the popup.
	 * callback: Function that is called when the user clicks the OK button. Has one array of the selected Actions as parameter.
	 * actions: The actions the user should be able to select from
	 * existingActions: An array of Actions that are already chosen.
	 **/
	openSelectActionsWindow: function(text, callback, actions, existingActions){
		//Only select actions if GameCreator isn't already paused for action selection.
		if(!GameCreator.paused){
			GameCreator.pauseGame();
			GameCreator.openSelectActionsWindow.setAction = callback;
			$("#selectActionResult").html("");
			
			// Populate the selected actions with the actions from the existingActions argument.
			if (!existingActions) {
				GameCreator.openSelectActionsWindow.selectedActions = [];
			} else {
				GameCreator.openSelectActionsWindow.selectedActions = existingActions
				for (var i = 0; i < existingActions.length; i++) {
					var action = existingActions[i];
					var selectedAction = {action: action.action, parameters: {}};

					$("#selectActionResult").append(GameCreator.htmlStrings.actionRow(existingActions[i].name, selectedAction));
				}
			}
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
		var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(object);
		$("#globalObjectList").append(listElementButton);
		$(listElementButton).on("click", function(e){
			$("#editGlobalObjectWindow").html(GameCreator.htmlStrings.editGlobalObjectWindow(object));
			$("#editGlobalObjectWindow").dialog( "option", "title", object.name );
			GameCreator.selectedGlobalObject = object;
			$("#editGlobalObjectWindow").dialog("open");
		});
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
			$("#editSceneObjectContent").html(GameCreator.htmlStrings.editMouseObjectForm(GameCreator.selectedObject));
		}
		else if(GameCreator.selectedObject.parent.objectType == "platformObject") {
			$("#editSceneObjectContent").html(GameCreator.htmlStrings.editPlatformObjectForm(GameCreator.selectedObject));
		}
		else if(GameCreator.selectedObject.parent.objectType == "topDownObject") {
			$("#editSceneObjectContent").html(GameCreator.htmlStrings.editTopDownObjectForm(GameCreator.selectedObject));
		}
	},
	
	//Since all inputs are tagged with "data-attrName" and "data-type" we have this general function for saving all object types.
	saveSceneObjectChanges: function() {
		var inputs = $("#editSceneObjectContent input, #editSceneObjectContent select");
		var input;
		for(var i = 0; i < inputs.length; i++) {
			input = $(inputs[i]);
			if(input.attr("data-type") == "string" && input.val().length != 0) {
				GameCreator.selectedObject[input.attr("data-attrName")] = input.val();
			}
			else if(input.attr("data-type") == "number" && input.val().length != 0) {
				GameCreator.selectedObject[input.attr("data-attrName")] = parseFloat(input.val());
			}
			else if(input.attr("data-type") == "bool" && input.val().length != 0) {
				GameCreator.selectedObject[input.attr("data-attrName")] = GameCreator.helperFunctions.parseBool(input.val());
			}
		}
		GameCreator.render();
	},
	
	drawRoute: function(route) {
		$(".routeNodeContainer").remove();
		var node;
		for(var i = 0; i < route.length; i++) {
			node = route[i];
			$("body").append(GameCreator.htmlStrings.routeNode(node, i));
		}
		$(".routeNode").on("mousedown", function(e) {
			GameCreator.draggedNode = this;
			return false;
		});
	}
}
