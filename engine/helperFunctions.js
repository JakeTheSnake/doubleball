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

GameCreator.helperFunctions.doCollision = function(object, targetObject){
	var currentActions = object.parent.collisionActions[targetObject.name];
	if(currentActions != undefined)
	{
		for (var j = 0; j < currentActions.length; j++) {
			
			currentActions[j].action.call(object, $.extend({collisionObject:targetObject}, currentActions[j].parameters));
		}
	}
	else
	{
		(function(targetObject){
			GameCreator.openSelectActionsWindow(
				"'" + object.parent.name + "' collided with '" + targetObject.name + "'",
				function(actions) {object.parent.collisionActions[targetObject.name] = actions;},
				$.extend(GameCreator.commonSelectableActions, GameCreator.collisionSelectableActions)
			)
		})(targetObject)
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
	var collidedBorder;
	var collisionObject;
	
	if(x < 1){
		collisionObject = GameCreator.collideBorderLObject;
		GameCreator.helperFunctions.doCollision(object, collisionObject);
	}
	if(x + width > GameCreator.width - 1){
		collisionObject = GameCreator.collideBorderRObject;
		GameCreator.helperFunctions.doCollision(object, collisionObject);
	}
	if(y < 1){
		collisionObject = GameCreator.collideBorderTObject;
		GameCreator.helperFunctions.doCollision(object, collisionObject);
	}
	if(y + height > GameCreator.height - 1){
		collisionObject = GameCreator.collideBorderBObject;
		GameCreator.helperFunctions.doCollision(object, collisionObject);
	}
	
	//If directing, check for collisions with all other game objs.
	if(GameCreator.state == 'directing') {
		for (var i=0;i < GameCreator.collidableObjects.length;++i) {
			var targetObject = GameCreator.collidableObjects[i];
			if(!(object == targetObject)) {
				var objWidth = targetObject.width;
				var objHeight = targetObject.height;
				var thisMidX = x + width / 2;
				var thisMidY = y + height / 2;
				var objMidX = targetObject.x + targetObject.width / 2;
				var objMidY = targetObject.y + targetObject.height / 2;
				if((Math.abs(thisMidX - objMidX) < width / 2 + objWidth / 2) && (Math.abs(thisMidY - objMidY) < height / 2 + objHeight / 2)) {
					//console.log("targetObject: " + object.name + " collided with " + targetObject.name);
					
					//Look through collisionActions to see if we already have an action defined for a collision with a targetObject with this name, if so, run that function instead
					
					GameCreator.helperFunctions.doCollision(object, targetObject);
				}
			}
		}
	}
	//Else we should just check for collisions with objects in our collisionAction collection.
	else
	{
	
	}
}

GameCreator.helperFunctions.calcAngularSpeed = function(maxSpeed){
	return Math.pow(Math.pow(maxSpeed, 2)/2, 0.5);
}

GameCreator.helperFunctions.toString = function(thing){
	if(typeof(thing) == "object")
		return thing.name;
	else
		return "" + thing;
}

GameCreator.helperFunctions.parseBool = function(string) {
	return string === 'true' ? true : false;
}

GameCreator.helperFunctions.calcUnitVector = function(x, y){
	var magnitude = Math.sqrt((x * x) + (y * y));
	if(magnitude === 0) {
		return {x: 0, y: 0};
	} else {
		return {x: x/magnitude, y: y/magnitude};	
	}
}

/**
 * name: Name of the object
 * operation: function(count), that decides if the condition
			  is fulfilled or not for this many found objects.
			  (At least, exactly, at most)
 */
GameCreator.helperFunctions.exists = function(name, operation) {
	var found = 0;
	for (var i = 0; i < GameCreator.collidableObjects.length; i++) {
		if (operation(found)) {
			return true;
		}
		if (GameCreator.collidableObjects[i].name == name) {
			found++;
		}
	}
	return false;
	// TODO, iterate through rest of runtime objects
}

GameCreator.helperFunctions.logOnce = function(obj) {
	if(!GameCreator.loggedOnce) {
		console.log(obj);
	}
	GameCreator.loggedOnce = true;
}
