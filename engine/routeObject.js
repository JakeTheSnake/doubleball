/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.RouteObject = function(args) {
        GameCreator.helpers.setStandardProperties(this, args);
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);

        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addCommonObjectViews(this);
            GameCreator.commonObjectControllers.addCommonObjectControllers(this);
        }
        

        this.objectAttributes = $.extend(this.objectAttributes, {
                
            });
        this.getDefaultState().attributes.speed = (!args.speed && args.speed !== 0) ? 300 : args.speed;   
        
        
        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isResizeable = true;

        this.objectType = "RouteObject";
    };

    GameCreator.RouteObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.RouteObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.RouteObject.objectAttributes = $.extend(GameCreator.RouteObject.objectAttributes, {
        "speed": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.RouteObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.RouteObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.RouteObject.prototype);

    GameCreator.RouteObject.prototype.initialize = function() {
        this.invalidated = true;
        this.attributes.speed = GameCreator.helpers.getRandomFromRange(this.attributes.speed);
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
        this.attributes.x = GameCreator.helpers.getRandomFromRange(this.attributes.x);
        this.attributes.y = GameCreator.helpers.getRandomFromRange(this.attributes.y);
    };

    GameCreator.RouteObject.prototype.calculateSpeed = function() {

    };

    GameCreator.RouteObject.prototype.getDefaultShootParameters = function(projectileSpeed, projectileAttributes) {
        var params = {};
        var unitVector = GameCreator.helpers.calcUnitVector(this.speedX, this.speedY);
        if (unitVector.x === 0 && unitVector.y === 0) {
            params.speedY = -projectileSpeed; // If shooting object is stationary
        } else {
            params.speedY = unitVector.y * projectileSpeed;
        }
        params.speedX = unitVector.x * projectileSpeed;
        params.x = this.attributes.x;
        params.y = this.attributes.y;
        return params;
    };

    GameCreator.RouteObject.prototype.getProjectileOriginOffset = function(projectileAttributes) {
        var result = {};
        result.x = this.attributes.x + this.attributes.width / 2;
        result.y = this.attributes.y + this.attributes.height / 2;
        return result;
    };

    GameCreator.RouteObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        //Array of Points. Points are {x:, y:, bounceNode} objects.
        sceneObject.route = [{x: args.x, y: args.y}];
        //Index of point that is currently the target.
        sceneObject.targetNode = args.targetNode !== undefined ? args.targetNode : 0;
        //If heading backwards or forwards through the grid. (Should switch when reaching a bounce node.)
        sceneObject.routeForward = args.routeForward !== undefined ? args.routeForward : true;
        sceneObject.attributes.speed = args.speed !== undefined ? args.speed : state.attributes.speed;
    };

    GameCreator.RouteObject.prototype.move = function(modifier) {
        var targetX, targetY, preDiffX, preDiffY, unitVector, postDiffX, postDiffY, nextIndexOffset;
        
        if (this.route.length === 0) {
            return;
        }
        if (this.attributes.speed !== 0) {
            GameCreator.invalidate(this);
        }
        targetX = this.route[this.targetNode].x;
        targetY = this.route[this.targetNode].y;
        preDiffX = this.attributes.x - targetX;
        preDiffY = this.attributes.y - targetY;
        unitVector = GameCreator.helpers.calcUnitVector(preDiffX, preDiffY);
        this.attributes.speedX = -unitVector.x * this.attributes.speed;
        this.attributes.speedY = -unitVector.y * this.attributes.speed;
        this.attributes.x += this.attributes.speedX * modifier;
        this.attributes.y += this.attributes.speedY * modifier;
        postDiffX = this.attributes.x - targetX;
        postDiffY = this.attributes.y - targetY;
        //Check if preDiff and postDiff have different "negativity" or are 0. If so we have reached (or moved past) our target.
        if (preDiffX * postDiffX <= 0 && preDiffY * postDiffY <= 0) {
            if (this.route[this.targetNode].bounceNode) {
                this.routeForward = !this.routeForward;
            }
            nextIndexOffset = this.routeForward ? 1 : -1;
            if (this.targetNode + nextIndexOffset >= this.route.length) {
                this.targetNode = 0;
            } else if (this.targetNode + nextIndexOffset < 0) {
                this.targetNode = this.route.length - 1;
            } else {
                this.targetNode = this.targetNode + nextIndexOffset;
            }
        }
    };
}());
