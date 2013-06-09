GameCreator.mouseObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		obj.image = image;
		obj.name = args.name;
		obj.x = args.x;
		obj.y = args.y;
		obj.width = args.width;
		obj.height = args.height;
		GameCreator.addObjFunctions.mouseObjectFunctions(obj);
		console.log(args);
		if(args.maxX)
			obj.maxX = args.maxX - obj.width;
		if(args.maxY)
			obj.maxY = args.maxY - obj.height;;
		if(args.minX)
			obj.minX = args.minX;
		if(args.minY)
			obj.minY = args.minY;
		GameCreator.collidableObjects.push(obj);
		GameCreator.movableObjects.push(obj);
		GameCreator.renderableObjects.push(obj);
		$(GameCreator.canvas).on("mousemove", function(evt)
		{
			obj.latestMouseX = evt.pageX;
			obj.latestMouseY = evt.pageY;
		});
		return obj;
	}
}

GameCreator.addObjFunctions.mouseObjectFunctions = function(mouseObject)
{
	mouseObject.maxX = GameCreator.width - mouseObject.width;
	mouseObject.maxY = GameCreator.height - mouseObject.height;
	mouseObject.minX = 0;
	mouseObject.minY = 0;
	mouseObject.latestMouseX = 0;
	mouseObject.latestMouseY = 0;
	
	mouseObject.move = function()
	{	
		var offset = $(GameCreator.canvas).offset();
		this.x = this.latestMouseX - offset.left;
		this.y = this.latestMouseY - offset.top;
		if(this.x > this.maxX)
			this.x = this.maxX;
		else if(this.x < this.minX)
			this.x = this.minX;
		if(this.y > this.maxY)
			this.y = this.maxY;
		else if(this.y < this.minY)
			this.y = this.minY;
	}
	
	mouseObject.collide = function()
	{
	
	}
}