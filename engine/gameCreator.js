var GameCreator = {
	height: 600,
	width: 800,
	paused: false,
	//State can be 'editing', 'directing' or 'playing'. 
	state: 'editing',
	then: undefined,
	context: undefined,
	collidableObjects: [],
	movableObjects: [],
	renderableObjects: [],
	objectsToDestroy: [],
	addObjFunctions: {},
	helperFunctions: {},
	selectedObject: undefined,
	htmlStrings: {
		collisionSelector: "<select id='collisionSelector'><option value='bounce'>Bounce</option><option value='stop'>Stop</option><option value='destroy'>Destroy</option></select>"
	},
	
	addActiveObject: function(args){
		console.log("adding active obj with args")
		console.log(args)
		var image = new Image();
		image.src = args.src;
		var activeObj = this.activeObject.New(image, args);
		image.onload = function() {
			activeObj.imageReady = true;
			GameCreator.render();
		};
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
	},
	
	runFrame: function(modifier){
		if(!GameCreator.paused){
			for (var i=0;i < GameCreator.collidableObjects.length;++i) {
				GameCreator.collidableObjects[i].collide();
			}
			for (var i=0;i < GameCreator.objectsToDestroy.length;++i)
			{
				GameCreator.objectsToDestroy[i].destroy();
			}
			GameCreator.objectsToDestroy.length = 0;
			for (var i=0;i < GameCreator.movableObjects.length;++i) {
				if(!GameCreator.paused)
				{
					GameCreator.movableObjects[i].move(modifier);
				}
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

	startPlaying: function() {
		then = Date.now();
		GameCreator.resumeGame();
		GameCreator.state = 'playing';
		setInterval(this.gameLoop, 1);
	},

	startDirecting: function(){
		then = Date.now();
		GameCreator.resumeGame();
		GameCreator.state = 'directing';
		setInterval(this.gameLoop, 1);
	},

	startEditing: function(){
		$(GameCreator.canvas).on("mousedown", function(e){
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
			if (obj.imageReady) {
				this.context.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
			}
		}
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
						obj1[functionToReplace] = function(){this.stopX(false)};
					}
					else if(obj2.name == "borderRight")
					{
						obj1[functionToReplace] = function(){this.stopX(true)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1[functionToReplace] = function(){this.stopY(false)};
					}
					else if(obj2.name == "borderBottom")
					{	
						obj1[functionToReplace] = function(){this.stopY(true)};
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
						obj1[functionToReplace] = function(){this.bounceX(false);};
					}
					else if(obj2.name == "borderRight")
					{
						obj1[functionToReplace] = function(){this.bounceX(true)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1[functionToReplace] = function(){this.bounceY(false)};
					}
					else if(obj2.name == "borderBottom")
					{
						obj1[functionToReplace] = function(){this.bounceY(true)};
					}
					//Colliding with something else than an edge.
					else
					{
						obj1.collisionActions.push({name: obj2.name, action: function(){obj1.objBounce(obj2)}});
					}
				}
				else if(selectedAction == 'destroy')
				{
					if(obj2.name == "borderLeft")
					{
						obj1[functionToReplace] = function(){GameCreator.objectsToDestroy.push(obj1)};
					}
					else if(obj2.name == "borderRight")
					{
						obj1[functionToReplace] = function(){GameCreator.objectsToDestroy.push(obj1)};
					}
					else if(obj2.name == "borderTop")
					{
						obj1[functionToReplace] = function(){GameCreator.objectsToDestroy.push(obj1)};
					}
					else if(obj2.name == "borderBottom")
					{
						obj1[functionToReplace] = function(){GameCreator.objectsToDestroy.push(obj1)};
					}
					else
					{
						obj1.collisionActions.push({name: obj2.name, action: function(){GameCreator.objectsToDestroy.push(obj1)}});
					}
				}
				GameCreator.resumeGame();
				window.hide();
				$("#saveActionsButton").off("click");
				return false;
			});
		}
	}
}