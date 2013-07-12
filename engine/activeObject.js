GameCreator.activeObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
		obj.image = image;
		obj.name = args.name;
		obj.width = args.width;
		obj.height = args.height;
		
		obj.isCollidable = true;
		obj.isMovable = true;
		obj.isRenderable = true;
		
		obj.objectType = "activeObject";
		
		GameCreator.globalObjects[obj.name] = obj;
		return obj;
	},
	
	createFromSaved: function(savedObject){
		
		var obj = Object.create(GameCreator.baseObject);
		
		var image = new Image();
		image.src = savedObject.imageSrc;
		obj.image = image;	
		
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
		
		obj.isCollidable = true;
		obj.isMovable = true;
		obj.isRenderable = true;
		
		image.onload = function() {
			obj.imageReady = true;
			GameCreator.render();
		};
		
		for(name in savedObject){
			if (savedObject.hasOwnProperty(name)) {
				obj[name] = savedObject[name];	
			}
		}
		
		GameCreator.globalObjects[obj.name] = obj;
		
		obj.instantiated();
		
		return obj;
	}
}

GameCreator.addObjFunctions.activeObjectFunctions = function(activeObject)
{	
	activeObject.calculateSpeed = function(modifier){
		this.speedY += this.accY;
		this.speedX += this.accX;
	}
	
	activeObject.shoot = function(staticParameters){
		var projectileSpeed = 600;
		var unitVector = GameCreator.helperFunctions.calcUnitVectorFromSpeed(this.speedX, this.speedY);
		GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: this.x, y: this.y, speedX: unitVector.x * projectileSpeed, speedY: unitVector.y * projectileSpeed});
	}
}
