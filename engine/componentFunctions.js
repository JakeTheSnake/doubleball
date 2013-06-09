GameCreator.addObjFunctions.bouncableObjectFunctions = function(object)
{
	object.objBounce = function(obj)
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
	
	object.bounceX = function(bounceLeftward){
		if(bounceLeftward)
		{
			this.speedX = -Math.abs(this.speedX);
		}
		else
		{
			this.speedX = Math.abs(this.speedX);
		}
	}
	
	object.bounceY = function(bounceUpward){
		if(bounceUpward)
		{
			this.speedY = -Math.abs(this.speedY);
		}
		else
		{
			this.speedY = Math.abs(this.speedY);
		}
	}
}

GameCreator.addObjFunctions.collidableObjectFunctions = function(object)
{
	//object.collideBorderL = function(){this.bounceX(false)},
	//object.collideBorderR = function(){this.bounceX(true)},
	//object.collideBorderT = function(){this.bounceY(false)},
	//object.collideBorderB = function(){this.bounceY(true)},
	object.collideBorderL = function(){GameCreator.selectActions(this, {name: "borderLeft"}, 'collideBorderL')},
	object.collideBorderR = function(){GameCreator.selectActions(this, {name: "borderRight"}, 'collideBorderR')},
	object.collideBorderT = function(){GameCreator.selectActions(this, {name: "borderTop"}, 'collideBorderT')},
	object.collideBorderB = function(){GameCreator.selectActions(this, {name: "borderBottom"}, 'collideBorderB')},
	
	//Contains Key/Value pairs of other objs and the function to run when colliding with them.
	object.collisionActions = [],
	
	object.collide = function() {
	
		if(this.objectBeneath != undefined)
			this.objectBeneath = false;
		
		//Check for border collisions.
		var x = this.x;
		var y = this.y;
		var width = this.width;
		var height = this.height;
		
		if(x < 1){
			this.collideBorderL();
		}
		else if(x + width > GameCreator.width - 1){
			this.collideBorderR();
		}
		if(y < 1){
			this.collideBorderT();
		}
		else if(y + height > GameCreator.height - 1){
			this.collideBorderB();
		}
		
		//If directing, check for collisions with all other game objs.
		if(GameCreator.state == 'directing')
		{
			for (var i=0;i < GameCreator.collidableObjects.length;++i) {
				var obj = GameCreator.collidableObjects[i];
				if(this.name != obj.name)
				{
					var objWidth = obj.width;
					var objHeight = obj.height;
					var thisMidX = x + width / 2;
					var thisMidY = y + height / 2;
					var objMidX = obj.x + obj.width / 2;
					var objMidY = obj.y + obj.height / 2;
					if((Math.abs(thisMidX - objMidX) < width / 2 + objWidth / 2) && (Math.abs(thisMidY - objMidY) < height / 2 + objHeight / 2))
					{
						//console.log("obj: " + this.name + " collided with " + obj.name);
						
						//Look through collisionActions to see if we already have an action defined for a collision with an obj with this name, if so, run that function instead
						var names = this.collisionActions.map(function(x){return x.name});
						var collisionActionIndex = $.inArray(obj.name, names);
						if(collisionActionIndex != -1)
						{
							this.collisionActions[collisionActionIndex].action();
						}
						else
						{
							//this.objBounce(obj);
							GameCreator.selectActions(this, obj);
						}
					}
				}
			}
		}
	}
},

GameCreator.addObjFunctions.stoppableObjectFunctions = function(object)
{
	object.objectBeneath = false;
	
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