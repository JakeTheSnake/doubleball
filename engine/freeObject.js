/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.FreeObject = function(args) {
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);

        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addCommonObjectViews(this);
            GameCreator.commonObjectControllers.addCommonObjectControllers(this);
        }
        
        GameCreator.helpers.setStandardProperties(this, args);


        this.getDefaultState().attributes.accX = args.accX || 0;
        this.getDefaultState().attributes.accY = args.accY || 0;
        this.getDefaultState().attributes.speedX = args.speedX || 0;
        this.getDefaultState().attributes.speedY = args.speedY || 0;
        
        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;

        this.objectType = "FreeObject";
    };

    GameCreator.FreeObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.FreeObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.FreeObject.objectAttributes = $.extend(GameCreator.FreeObject.objectAttributes, {
        "accX": GameCreator.htmlStrings.rangeInput,
        "accY": GameCreator.htmlStrings.rangeInput,
        "speedX": GameCreator.htmlStrings.rangeInput,
        "speedY": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.FreeObject.objectSceneAttributes = $.extend({}, GameCreator.FreeObject.objectAttributes);
    delete GameCreator.FreeObject.objectSceneAttributes["image"];

    GameCreator.FreeObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.FreeObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.FreeObject.prototype);

    GameCreator.FreeObject.prototype.initialize = function() {
        this.invalidated = true;
        this.attributes.speedY = GameCreator.helpers.getRandomFromRange(this.attributes.speedY);
        this.attributes.speedX = GameCreator.helpers.getRandomFromRange(this.attributes.speedX);
        this.attributes.accY = GameCreator.helpers.getRandomFromRange(this.attributes.accY);
        this.attributes.accX = GameCreator.helpers.getRandomFromRange(this.attributes.accX);
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
        this.attributes.x = GameCreator.helpers.getRandomFromRange(this.attributes.x);
        this.attributes.y = GameCreator.helpers.getRandomFromRange(this.attributes.y);
    };

    GameCreator.FreeObject.prototype.calculateSpeed = function() {
        this.attributes.speedY += this.attributes.accY;
        this.attributes.speedX += this.attributes.accX;
    };

    GameCreator.FreeObject.prototype.shoot = function(staticParameters) {
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var unitVector = GameCreator.helpers.calcUnitVector(this.attributes.speedX, this.attributes.speedY);
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
            x = this.attributes.x;
            y = this.attributes.y;
            break;
        case "Up":
            x = this.attributes.x + this.attributes.width / 2;
            y = this.attributes.y;
            speedY = -projectileSpeed;
            break;
        case "Down":
            x = this.attributes.x + this.attributes.width / 2;
            y = this.attributes.y + this.attributes.height;
            speedY = projectileSpeed;
            break;
        case "Left":
            x = this.attributes.x;
            y = this.attributes.y + this.attributes.height / 2;
            speedX = -projectileSpeed;
            break;
        case "Right":
            x = this.attributes.x + this.attributes.width;
            y = this.attributes.y + this.attributes.height / 2;
            speedX = projectileSpeed;
            break;
        default:
            target = GameCreator.getRuntimeObject(staticParameters.projectileDirection);
            if (!target) {
                // We did not find the target, return without shooting anything.
                return;
            }
            x = this.attributes.x + this.attributes.width / 2;
            y = this.attributes.y + this.attributes.height / 2;
            unitVector = GameCreator.helpers.calcUnitVector(target.x - this.attributes.x, target.y - this.attributes.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };

    GameCreator.FreeObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.accX = args.accX !== undefined ? args.accX : state.attributes.accX;
        sceneObject.accY = args.accY !== undefined ? args.accY : state.attributes.accY;
        sceneObject.speedX = args.speedX !== undefined ? args.speedX : state.attributes.speedX;
        sceneObject.speedY = args.speedY !== undefined ? args.speedY : state.attributes.speedY;
    };

    GameCreator.FreeObject.prototype.move = function(modifier) {
        var targetX, targetY, preDiffX, preDiffY, unitVector, postDiffX, postDiffY, nextIndexOffset;
        if (this.attributes.speedX !== 0 || this.attributes.speedY !== 0) {
            GameCreator.invalidate(this);
        }
        this.attributes.x += this.attributes.speedX * modifier;
        this.attributes.y += this.attributes.speedY * modifier;
    };
}());
