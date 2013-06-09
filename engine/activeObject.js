GameCreator.activeObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bouncableObjectFunctions(obj);
		obj.image = image;
		obj.name = args.name;
		obj.x = args.x;
		obj.y = args.y;
		obj.width = args.width;
		obj.height = args.height;
		obj.speedX = args.speedX;
		obj.speedY = args.speedY;
		GameCreator.collidableObjects.push(obj);
		GameCreator.movableObjects.push(obj);
		GameCreator.renderableObjects.push(obj);
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
