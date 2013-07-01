GameCreator.addObjFunctions.bounceableObjectFunctions = function(object)
{
	object.bounce = function(params)
	{
		switch(GameCreator.helperFunctions.determineQuadrant(params.collisionObject, this)){
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
	object.stop = function(params)
	{
		obj = params.collisionObject
		if(obj == undefined)
		{
			this.speedY = 0;
			this.speedX = 0;	
		}
		else
		{
			var quadrant = GameCreator.helperFunctions.determineQuadrant(obj, this);
			if(this.speedY > 0 && quadrant == 1)
			{
				this.speedY = 0;
				this.objectBeneath = true;
			}
			
			if(this.speedX < 0 && quadrant == 2)
				this.speedX = 0;
	
			if(this.speedY < 0 && quadrant == 3)
				this.speedY = 0;
			
			if(this.speedX > 0 && quadrant == 4)
			{
				this.speedX = 0;
			}	
		}
	};
}