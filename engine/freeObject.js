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
        if (this.attributes.accX > 0) {
            if (this.objectsRight.length === 0) this.attributes.speedX += this.attributes.accX;
        } else {
            if (this.objectsLeft.length === 0) this.attributes.speedX += this.attributes.accX;
        }
        if (this.attributes.accY > 0) {
            if (this.objectsBeneath.length === 0) this.attributes.speedY += this.attributes.accY;
        } else {
            if (this.objectsAbove.length === 0) this.attributes.speedY += this.attributes.accY;
        }
    };

    GameCreator.FreeObject.prototype.shoot = function(staticParameters) {
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var unitVector = GameCreator.helpers.calcUnitVector(this.attributes.speedX, this.attributes.speedY);
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var target;
        var objectToShoot = GameCreator.helpers.getGlobalObjectById(Number(staticParameters.objectToShoot));
        var objectToShootAttributes = objectToShoot.getDefaultState().attributes;
        switch (staticParameters.projectileDirection.type) {
            case 'Default':
                if (unitVector.x === 0 && unitVector.y === 0) {
                    speedY = -projectileSpeed; // If shooting object is stationary
                } else {
                    speedY = unitVector.y * projectileSpeed;
                }
                speedX = unitVector.x * projectileSpeed;
                x = this.attributes.x;
                y = this.attributes.y;
                break;
            case 'Up':
                x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
                y = this.attributes.y - objectToShootAttributes.height;
                speedY = -projectileSpeed;
                break;
            case 'Down':
                x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
                y = this.attributes.y + this.attributes.height;
                speedY = projectileSpeed;
                break;
            case 'Left':
                x = this.attributes.x - objectToShootAttributes.width;
                y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
                speedX = -projectileSpeed;
                break;
            case 'Right':
                x = this.attributes.x + this.attributes.width;
                y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
                speedX = projectileSpeed;
                break;
            case 'Towards':
                var possibleTargets = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(staticParameters.projectileDirection.target));
                if (!possibleTargets || possibleTargets.length === 0) {
                    // We did not find the target, return without shooting anything.
                    return;
                }
                target = possibleTargets[0];
                x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
                y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
                unitVector = GameCreator.helpers.calcUnitVector(target.attributes.x - this.attributes.x, target.attributes.y - this.attributes.y);
                speedX = unitVector.x * projectileSpeed;
                speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(objectToShoot, {x: x, y: y, speedX: speedX, speedY: speedY});
    };

    GameCreator.FreeObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.attributes.accX = args.accX !== undefined ? args.accX : state.attributes.accX;
        sceneObject.attributes.accY = args.accY !== undefined ? args.accY : state.attributes.accY;
        sceneObject.attributes.speedX = args.speedX !== undefined ? args.speedX : state.attributes.speedX;
        sceneObject.attributes.speedY = args.speedY !== undefined ? args.speedY : state.attributes.speedY;
    };
}());
