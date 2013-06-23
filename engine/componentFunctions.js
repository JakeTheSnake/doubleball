GameCreator.addObjFunctions.bouncableObjectFunctions = function(object)
{
	object.bounce = function(obj)
	{
		switch(GameCreator.helperFunctions.determineQuadrant(obj, this)){
			case 1:
			this.speedY = -Math.abs(this.speedY);
			break;
			
			case 2:
			this.speedX = Math.abs(this.speedX);
			break;
			
			case 3:
			this.speedY = Math.abs(this.speedY);
			break;
			
			case 4:
			this.speedX = -Math.abs(this.speedX);
			break;
		}
	}
	
}

GameCreator.addObjFunctions.collidableObjectFunctions = function(object)
{
	//object.collideBorderL = function(){this.bounceX(false)},
	//object.collideBorderR = function(){this.bounceX(true)},
	//object.collideBorderT = function(){this.bounceY(false)},
	//object.collideBorderB = function(){this.bounceY(true)},
	object.collideBorderL = undefined;
	object.collideBorderR = undefined;
	object.collideBorderT = undefined;
	object.collideBorderB = undefined;
	
	//Contains Key/Value pairs of other objs and the function to run when colliding with them.
	//TODO: Switch to dictionary where key is the name of the object.
	object.collisionActions = {};
},

GameCreator.addObjFunctions.stoppableObjectFunctions = function(object)
{	
	object.stopX = function(rightCollision){
		if(rightCollision && this.speedX > 0 || !rightCollision && this.speedX < 0)
			this.speedX = 0;
	};
	
	object.stopY = function(bottomCollision){
		if(bottomCollision && this.speedY > 0 || !bottomCollision && this.speedY < 0)
		{
			this.speedY = 0;
		}
		if(bottomCollision)
			this.objectBeneath = true;
	};
	
	object.objStop = function(obj)
	{
		switch(GameCreator.helperFunctions.determineQuadrant(obj, this)){
			case 1:
			if(this.speedY > 0)
				this.speedY = 0;
			this.objectBeneath = true;
			break;
			
			case 2:
			if(this.speedX > 0)
				this.speedX = 0;
			break;
			
			case 3:
			if(this.speedY < 0)
				this.speedY = 0;
			break;
			
			case 4:
			if(this.speedX < 0)
				this.speedX = 0;
			break;
		}	
	};
}