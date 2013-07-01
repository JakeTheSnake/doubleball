GameCreator.mouseObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.mouseObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		obj.image = image;
		obj.name = args.name;
		obj.width = args.width;
		obj.height = args.height;
		obj.isCollidable = true;
		obj.isMovable = true;
		obj.isRenderable = true;
		GameCreator.globalObjects[obj.name] = obj;
		return obj;
	}
}

GameCreator.addObjFunctions.mouseObjectFunctions = function(mouseObject)
{
	mouseObject.latestMouseX = 0;
	mouseObject.latestMouseY = 0;
	
	mouseObject.calculateSpeed = function(){};
	
	mouseObject.move = function()
	{	
		var offset = $(GameCreator.canvas).offset();
		this.x = this.parent.latestMouseX - offset.left;
		this.y = this.parent.latestMouseY - offset.top;
		if(this.x > this.maxX)
			this.x = this.maxX;
		else if(this.x < this.minX)
			this.x = this.minX;
		if(this.y > this.maxY)
			this.y = this.maxY;
		else if(this.y < this.minY)
			this.y = this.minY;
	};
	
	mouseObject.instantiated = function()
	{
		var that = this;
		$(GameCreator.canvas).on("mousemove." + this.name, function(evt)
		{
			that.latestMouseX = evt.pageX;
			that.latestMouseY = evt.pageY;
		});
	};
	
	mouseObject.onDestroy = function()
	{
		$(GameCreator.canvas).off("mousemove." + this.name);
	};
}