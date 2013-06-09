GameCreator.platformObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.platformObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bouncableObjectFunctions(obj);
		obj.image = image;
		obj.name = args.name;
		obj.x = args.x;
		obj.y = args.y;
		obj.width = args.width;
		obj.height = args.height;
		if(args.speedX)
			obj.speedX = args.speedX;
		if(args.speedY)
			obj.speedY = args.speedY;
		GameCreator.collidableObjects.push(obj);
		GameCreator.movableObjects.push(obj);
		GameCreator.renderableObjects.push(obj);
		
		$(document).keydown(function(e){
			console.log(e.which)
			switch(e.which){
				case 37:
				obj.keyLeftPressed = true;
				break;
				
				case 39:
				obj.keyRightPressed = true;
				break;
				
				case 38:
				obj.keyUpPressed = true;
				break;
				
				default: return;	
			}
			e.preventDefault();
		});
		
		$(document).keyup(function(e){
			switch(e.which){
				case 37:
				obj.keyLeftPressed = false;
				break;
				
				case 39:
				obj.keyRightPressed = false;
				break;
				
				case 38:
				obj.keyUpPressed = false;
				break;
				
				default: return;	
			}
			e.preventDefault();
		});
		
		return obj;
	}
}

GameCreator.addObjFunctions.platformObjectFunctions = function(platformObject)
{
	platformObject.accY = 2;
	platformObject.moveSpeed = 200;
	platformObject.keyLeftPressed = false;
	platformObject.keyRightPressed = false;
	platformObject.keyUpPressed = false;
	platformObject.speedX = 0;
	platformObject.speedY = 0;
	
	platformObject.move = function(modifier)
	{	
		//Should only be able to affect movement if there is something beneath object.
		if(this.keyUpPressed && this.objectBeneath)
			this.speedY = -300;
	
		if(this.keyRightPressed && this.objectBeneath)
		{
			this.accX = 5;
		}
		else if(this.keyLeftPressed && this.objectBeneath)
		{
			this.accX = -5;
		}
		else if(this.objectBeneath)
		{
			this.accX = 0;
			Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
		}
		else
			this.accX = 0;
			
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
		
		//Add acceleration only if object is moving below max movement speed in that direction.
		if(this.accX > 0 && this.speedX < 200 || this.accX < 0 && this.speedX > -200)
			this.speedX += this.accX;
			
		this.speedY += this.accY;
	}
}
