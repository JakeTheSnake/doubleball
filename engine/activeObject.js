/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.ActiveObject = function(image, args) {
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);

        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addCommonObjectViews(this);
            GameCreator.commonObjectControllers.addCommonObjectControllers(this);
        }
        
        GameCreator.helperFunctions.setStandardProperties(this, image, args);

        this.movementType = args.movementType || "free";

        if (this.movementType === "free") {
            this.getDefaultState().accX = args.accX || 0;
            this.getDefaultState().accY = args.accY || 0;
            this.getDefaultState().speedX = args.speedX || 0;
            this.getDefaultState().speedY = args.speedY || 0;
        } else {
            this.getDefaultState().speed = (!args.speed && args.speed !== 0) ? 300 : args.speed;   
        }
        
        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;

        this.objectType = "ActiveObject";

        this.movementType = args.movementType || "free";
    };

    GameCreator.ActiveObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.ActiveObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.ActiveObject.prototype);

    GameCreator.ActiveObject.prototype.initialize = function() {
        this.invalidated = true;
        this.speedY = GameCreator.helperFunctions.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helperFunctions.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helperFunctions.getRandomFromRange(this.accY);
        this.accX = GameCreator.helperFunctions.getRandomFromRange(this.accX);
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
        this.x = GameCreator.helperFunctions.getRandomFromRange(this.x);
        this.y = GameCreator.helperFunctions.getRandomFromRange(this.y);
    };

    GameCreator.ActiveObject.prototype.calculateSpeed = function() {
        this.speedY += this.accY;
        this.speedX += this.accX;
    };

    GameCreator.ActiveObject.prototype.shoot = function(staticParameters) {
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var unitVector = GameCreator.helperFunctions.calcUnitVector(this.speedX, this.speedY);
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var target;
        switch (staticParameters.projectileDirection) {
        case "Default":
            if (unitVector.x === 0 && unitVector.y === 0) {
                speedY = -projectileSpeed; // If shooting object is stationary
            } else {
                speedY = unitVector.y * projectileSpeed;
            }
            speedX = unitVector.x * projectileSpeed;
            x = this.x;
            y = this.y;
            break;
        case "Up":
            x = this.x + this.width / 2;
            y = this.y;
            speedY = -projectileSpeed;
            break;
        case "Down":
            x = this.x + this.width / 2;
            y = this.y + this.height;
            speedY = projectileSpeed;
            break;
        case "Left":
            x = this.x;
            y = this.y + this.height / 2;
            speedX = -projectileSpeed;
            break;
        case "Right":
            x = this.x + this.width;
            y = this.y + this.height / 2;
            speedX = projectileSpeed;
            break;
        default:
            target = GameCreator.getRuntimeObject(staticParameters.projectileDirection);
            if (!target) {
                // We did not find the target, return without shooting anything.
                return;
            }
            x = this.x + this.width / 2;
            y = this.y + this.height / 2;
            unitVector = GameCreator.helperFunctions.calcUnitVector(target.x - this.x, target.y - this.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };

    GameCreator.ActiveObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();

        if (sceneObject.movementType === 'route') {
            //Array of Points. Points are {x:, y:, bounceNode} objects.
            sceneObject.route = [{x: this.x, y: this.y}];
            //Index of point that is currently the target.
            sceneObject.targetNode = args.targetNode !== undefined ? args.targetNode : 0;
            //If heading backwards or forwards through the grid. (Should switch when reaching a bounce node.)
            sceneObject.routeForward = args.routeForward !== undefined ? args.routeForward : true;
            sceneObject.speed = args.speed !== undefined ? args.speed : state.speed;
        } else {
            sceneObject.accX = args.accX !== undefined ? args.accX : state.accX;
            sceneObject.accY = args.accY !== undefined ? args.accY : state.accY;
            sceneObject.speedX = args.speedX !== undefined ? args.speedX : state.speedX;
            sceneObject.speedY = args.speedY !== undefined ? args.speedY : state.speedY;
        }
    };

    GameCreator.ActiveObject.prototype.move = function(modifier) {
        var targetX, targetY, preDiffX, preDiffY, unitVector, postDiffX, postDiffY, nextIndexOffset;
        switch (this.parent.movementType) {
        case "free":
            if (this.speedX !== 0 || this.speedY !== 0) {
                GameCreator.invalidate(this);
            }
            this.x += this.speedX * modifier;
            this.y += this.speedY * modifier;
            break;
        case "route":
            if (this.route.length === 0) {
                return;
            }
            if (this.speed !== 0) {
                GameCreator.invalidate(this);
            }
            targetX = this.route[this.targetNode].x;
            targetY = this.route[this.targetNode].y;
            preDiffX = this.x - targetX;
            preDiffY = this.y - targetY;
            unitVector = GameCreator.helperFunctions.calcUnitVector(preDiffX, preDiffY);
            this.x -= unitVector.x * this.speed * modifier;
            this.y -= unitVector.y * this.speed * modifier;
            postDiffX = this.x - targetX;
            postDiffY = this.y - targetY;
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
            break;
        }
    };
}());
