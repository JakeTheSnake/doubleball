GameCreator.helperFunctions.determineQuadrant = function(base, obj)
{
	var x = obj.x;
	var y = obj.y;
	var width = obj.width;
	var height = obj.height;
	var baseWidth = base.width;
	var baseHeight = base.height;
	var objMidX = x + width / 2;
	var objMidY = y + height / 2;
	var baseMidX = base.x + base.width / 2;
	var baseMidY = base.y + base.height / 2;
	var baseEdgeTL = {x: base.x, y: base.y};
	var baseEdgeTR = {x: base.x + baseWidth, y: base.y};
	var baseEdgeBL = {x: base.x + baseHeight, y: base.y};
	var baseEdgeBR = {x: base.x + baseWidth, y: base.y + baseHeight};
	
	//Top left quadrant
	if(objMidX - baseMidX <= 0 && objMidY - baseMidY <= 0)
	{
		if(objMidX - baseEdgeTL.x > objMidY - baseEdgeTL.y)
		{	
			return 1;
		}
		else
		{
			return 4;
		}
	}
	//Top right quadrant
	else if(objMidX - baseMidX >= 0 && objMidY - baseMidY <= 0)
	{
		if(objMidX - baseEdgeTR.x < baseEdgeTR.y - objMidY)
		{
			return 1;
		}
		else
		{
			return 2;
		}
	}
	//Bottom right quadrant
	else if(objMidX - baseMidX >= 0 && objMidY - baseMidY >= 0)
	{
		if(objMidX - baseEdgeBR.x < objMidY - baseEdgeBR.y )
		{
			return 3;
		}
		else
		{
			return 2;
		}
	}
	//Bottom left quadrant
	else if(objMidX - baseMidX <= 0 && objMidY - baseMidY >= 0)
	{
		if(baseEdgeBL.x - objMidX < objMidY - baseEdgeBL.y)
		{
			return 3;
		}
		else
		{
			return 4;
		}
	}
}

GameCreator.helperFunctions.checkCollisions = function(object) {
	if(object.objectBeneath != undefined)
		object.objectBeneath = false;
	
	//Check for border collisions.
	var x = object.x;
	var y = object.y;
	var width = object.width;
	var height = object.height;
	
	if(x < 1){
		object.parent.collideBorderL.call(object);
	}
	else if(x + width > GameCreator.width - 1){
		object.parent.collideBorderR.call(object);
	}
	if(y < 1){
		object.parent.collideBorderT.call(object);
	}
	else if(y + height > GameCreator.height - 1){
		object.parent.collideBorderB.call(object);
	}
	
	//If directing, check for collisions with all other game objs.
	if(GameCreator.state == 'directing')
	{
		for (var i=0;i < GameCreator.collidableObjects.length;++i) {
			var targetObject = GameCreator.collidableObjects[i];
			if(!(object == targetObject))
			{
				var objWidth = targetObject.width;
				var objHeight = targetObject.height;
				var thisMidX = x + width / 2;
				var thisMidY = y + height / 2;
				var objMidX = targetObject.x + targetObject.width / 2;
				var objMidY = targetObject.y + targetObject.height / 2;
				if((Math.abs(thisMidX - objMidX) < width / 2 + objWidth / 2) && (Math.abs(thisMidY - objMidY) < height / 2 + objHeight / 2))
				{
					//console.log("targetObject: " + object.name + " collided with " + targetObject.name);
					
					//Look through collisionActions to see if we already have an action defined for a collision with a targetObject with this name, if so, run that function instead
					var names = object.parent.collisionActions.map(function(x){return x.name});
					var collisionActionIndex = $.inArray(targetObject.name, names);
					if(collisionActionIndex != -1)
					{
						object.parent.collisionActions[collisionActionIndex].action.call(object, targetObject);
					}
					else
					{
						GameCreator.selectActions(object, targetObject);
					}
				}
			}
		}
	}
	//Else we should just check for collisions with objects in our collisionAction collection.
	else
	{
	
	}
}