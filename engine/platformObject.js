GameCreator.platformObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.platformObjectFunctions(obj);
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
		if(this.parent.keyUpPressed && this.objectBeneath)
			this.speedY = -300;
	
		if(this.parent.keyRightPressed)
		{
			this.accX = 8;
		}
		else if(this.parent.keyLeftPressed)
		{
			this.accX = -8;
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
		if(this.accX > 0 && this.speedX < 250 || this.accX < 0 && this.speedX > -250)
			this.speedX += this.accX;
			
		this.speedY += this.accY;
	}
	
	platformObject.instantiated = function(){
		var that = this;
		$(document).keydown(function(e){
			console.log(e.which)
			switch(e.which){
				case 37:
				that.keyLeftPressed = true;
				break;
				
				case 39:
				that.keyRightPressed = true;
				break;
				
				case 38:
				that.keyUpPressed = true;
				break;
				
				default: return;	
			}
			e.preventDefault();
		});
		
		$(document).keyup(function(e){
			switch(e.which){
				case 37:
				that.keyLeftPressed = false;
				break;
				
				case 39:
				that.keyRightPressed = false;
				break;
				
				case 38:
				that.keyUpPressed = false;
				break;
				
				default: return;	
			}
			e.preventDefault();
		});
	}
}
