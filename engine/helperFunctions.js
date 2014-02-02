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
    targetObject.invalidated = true;
    if(currentActions != undefined)
    {
        for (var j = 0; j < currentActions.length; j++) {
            GameCreator.helperFunctions.runAction(object, currentActions[j],$.extend({collisionObject:targetObject}, currentActions[j].parameters));
        }
    }
    else if (GameCreator.state !== 'playing')
    {
    	var actions;
    	if(object.parent.objectType === "mouseObject") {
    		actions = GameCreator.actionGroups.mouseCollisionActions;
    	} else {
    		actions = GameCreator.actionGroups.collisionActions;
    	}
        GameCreator.UI.openEditActionsWindow(
            "'" + object.parent.name + "' collided with '" + targetObject.name + "'",
            actions,
            object.parent.collisionActions,
            targetObject.name,
            object.parent.name
        )
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
    var i, j;
    
    if(x < 1){
        collisionObject = GameCreator.borderObjects.borderL;
        GameCreator.helperFunctions.doCollision(object, collisionObject);
    }
    if(x + width > GameCreator.width - 1){
        collisionObject = GameCreator.borderObjects.borderR;
        GameCreator.helperFunctions.doCollision(object, collisionObject);
    }
    if(y < 1){
        collisionObject = GameCreator.borderObjects.borderT;
        GameCreator.helperFunctions.doCollision(object, collisionObject);
    }
    if(y + height > GameCreator.height - 1){
        collisionObject = GameCreator.borderObjects.borderB;
        GameCreator.helperFunctions.doCollision(object, collisionObject);
    }
    
    if(GameCreator.state === 'directing') {
        var objectNames = Object.keys(GameCreator.collidableObjects)
        for (j = 0; j < objectNames.length; j++) {
            var objectName = objectNames[j];
            if (GameCreator.collidableObjects.hasOwnProperty(objectName)) {
                for (i = 0; i < GameCreator.collidableObjects[objectName].length; i++) {
                    var targetObject = GameCreator.collidableObjects[objectName][i];
                    if (GameCreator.helperFunctions.checkObjectCollision(object, targetObject)) {
                        GameCreator.helperFunctions.doCollision(object, targetObject);
                    }
                }   
            }   
        }
    }
    else //Playing
    {
        var objectNames = Object.keys(object.parent.collisionActions)
        for (j = 0 ; j < objectNames.length; j++) {
            var objectName = objectNames[j];
            if (object.parent.collisionActions[objectName].length > 0 && GameCreator.collidableObjects[objectName]) {
                for (i = 0; i < GameCreator.collidableObjects[objectName].length; i++) {
                    var targetObject = GameCreator.collidableObjects[objectName][i];
                    if (GameCreator.helperFunctions.checkObjectCollision(object, targetObject)) {
                        GameCreator.helperFunctions.doCollision(object, targetObject);
                    }
                }
            }
        }
    }
}

GameCreator.helperFunctions.checkObjectCollision = function(object, targetObject) {
    if (!(object == targetObject)) {
        var targetWidth = targetObject.width;
        var targetHeight = targetObject.height;
        var width = object.width;
        var height = object.height;
        var thisMidX = object.x + width / 2;
        var thisMidY = object.y + height / 2;
        var targetMidX = targetObject.x + targetObject.width / 2;
        var targetMidY = targetObject.y + targetObject.height / 2;
        if ((Math.abs(thisMidX - targetMidX) < width / 2 + targetWidth / 2) && (Math.abs(thisMidY - targetMidY) < height / 2 + targetHeight / 2)) {
            //console.log("targetObject: " + object.name + " collided with " + targetObject.name);
            //Look through collisionActions to see if we already have an action defined for a collision with a targetObject with this name, if so, run that function instead
            return true;
        }
    }
    return false;
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

GameCreator.helperFunctions.parseRange = function(string) {
    return string.split(":", 2);
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
};

GameCreator.helperFunctions.findObject = function(name) {
    var object;
    if(!(object = GameCreator.globalObjects[name])) {
        object = GameCreator.borderObjects[name];
    }
    return object;
};

GameCreator.helperFunctions.getValue = function(input) {
    if(input.attr("data-type") == "string" && input.val().length != 0) {
        return input.val();
    }
    else if(input.attr("data-type") == "number" && input.val().length != 0) {
        return parseFloat(input.val());
    }
    else if(input.attr("data-type") == "bool" && input.val().length != 0) {
        return GameCreator.helperFunctions.parseBool(input.val());
    }
    else if(input.attr("data-type") == "range" && input.val().length != 0) {
        var range = GameCreator.helperFunctions.parseRange(input.val());
        for(var i = 0; i < range.length; i++) {
        	range[i] = parseFloat(range[i]);
        }
        return range;
    }
    else {
        return input.val();
    }
};

GameCreator.helperFunctions.getRandomFromRange = function(range) {
    var value;
    if (Array.isArray(range)) {
        if (range.length === 2) {
            var max = parseInt(range[1]);
            var min = parseInt(range[0]);
            value = Math.floor((Math.random()*(max-min)) + min);
        }
        else {
            value = parseInt(range[0]);
        }
    }
    else {
        value = parseInt(range);
    }
    return value;
};

GameCreator.helperFunctions.runAction = function(runtimeObj, actionToRun, parameters) {
    var timerFunction;

    if (actionToRun.timing.type === "after") {
        timerFunction = GameCreator.timerHandler.registerOffset;
    } else if (actionToRun.timing.type === "at") {
        timerFunction = GameCreator.timerHandler.registerFixed;
    } else if (actionToRun.timing.type === "every") {
        timerFunction = GameCreator.timerHandler.registerInterval;
    } else {
        if(GameCreator.actions[actionToRun.name].runnable.call(runtimeObj)) {
	        GameCreator.actions[actionToRun.name].action.call(runtimeObj, parameters);
            return;
        }
    }

    (function(obj, curAction, curParams, curTimerFunction){
            curTimerFunction(
                GameCreator.helperFunctions.getRandomFromRange(curAction.timing.time),
                function() {
                    if (GameCreator.actions[curAction.name].runnable.call(obj)) {
                        GameCreator.actions[curAction.name].action.call(obj, curParams);
                        return true;
                    } else {
                        return false;
                    }
                });
        })(runtimeObj, actionToRun, parameters, timerFunction);

}

GameCreator.helperFunctions.calculateScene = function(activeScene, params){
	switch(params.changeType){
		case 'increment':
			return activeScene + params.changeValue;
		case 'decrement':
			return activeScene - params.changeValue;
		case 'setScene':
		 	return params.changeValue;
	}
}