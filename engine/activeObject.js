GameCreator.activeObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bouncableObjectFunctions(obj);
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

GameCreator.addObjFunctions.activeObjectFunctions = function(activeObject)
{	
	activeObject.move = function(modifier){
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
		this.speedY += this.accY;
		this.speedX += this.accX;
	}
}
