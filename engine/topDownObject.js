/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.TopDownObject = function(args) {
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);
        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addPlayerObjectControllers(this);
        }
        GameCreator.helpers.setStandardProperties(this, args);

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;

        this.getDefaultState().attributes.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? 300 : args.maxSpeed;
        
        this.objectType = "TopDownObject";
    };

    GameCreator.TopDownObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.TopDownObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.TopDownObject.objectAttributes = $.extend(GameCreator.TopDownObject.objectAttributes, {
        "maxSpeed": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.TopDownObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.TopDownObject.prototype);

    GameCreator.TopDownObject.prototype.initialize = function() {
        this.invalidated = true;
        this.attributes.speedY = GameCreator.helpers.getRandomFromRange(this.attributes.speedY);
        this.attributes.speedX = GameCreator.helpers.getRandomFromRange(this.attributes.speedX);
        this.attributes.accY = GameCreator.helpers.getRandomFromRange(this.attributes.accY);
        this.attributes.accX = GameCreator.helpers.getRandomFromRange(this.attributes.accX);
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
        this.attributes.x = GameCreator.helpers.getRandomFromRange(this.attributes.x);
        this.attributes.y = GameCreator.helpers.getRandomFromRange(this.attributes.y);
        this.attributes.maxSpeed = GameCreator.helpers.getRandomFromRange(this.attributes.maxSpeed);
    };

    GameCreator.TopDownObject.prototype.calculateSpeed = function() {
        var maxSpeed = this.attributes.maxSpeed;
        var angularMaxSpeed = GameCreator.helpers.calcAngularSpeed(maxSpeed);
        //Should only be able to affect movement if there is something beneath object.
        if (GameCreator.keys.keyUpPressed && !GameCreator.keys.keyRightPressed && !GameCreator.keys.keyDownPressed && !GameCreator.keys.keyLeftPressed) {
            this.facing = 1;
            this.attributes.speedX = 0;
            if (this.objectsAbove.length === 0) this.attributes.speedY = -maxSpeed;
        } else if (GameCreator.keys.keyUpPressed && GameCreator.keys.keyRightPressed && !GameCreator.keys.keyDownPressed && !GameCreator.keys.keyLeftPressed) {
            this.facing = 2;
            if (this.objectsRight.length === 0) this.attributes.speedX = angularMaxSpeed;
            if (this.objectsAbove.length === 0) this.attributes.speedY = -angularMaxSpeed;
        } else if (!GameCreator.keys.keyUpPressed && GameCreator.keys.keyRightPressed && !GameCreator.keys.keyDownPressed && !GameCreator.keys.keyLeftPressed) {
            this.facing = 3;
            if (this.objectsRight.length === 0) this.attributes.speedX = maxSpeed;
            this.attributes.speedY = 0;
        } else if (!GameCreator.keys.keyUpPressed && GameCreator.keys.keyRightPressed && GameCreator.keys.keyDownPressed && !GameCreator.keys.keyLeftPressed) {
            this.facing = 4;
            if (this.objectsRight.length === 0) this.attributes.speedX = angularMaxSpeed;
            if (this.objectsBeneath.length === 0) this.attributes.speedY = angularMaxSpeed;
        } else if (!GameCreator.keys.keyUpPressed && !GameCreator.keys.keyRightPressed && GameCreator.keys.keyDownPressed && !GameCreator.keys.keyLeftPressed) {
            this.facing = 5;
            this.attributes.speedX = 0;
            if (this.objectsBeneath.length === 0) this.attributes.speedY = maxSpeed;
        } else if (!GameCreator.keys.keyUpPressed && !GameCreator.keys.keyRightPressed && GameCreator.keys.keyDownPressed && GameCreator.keys.keyLeftPressed) {
            this.facing = 6;
            if (this.objectsLeft.length === 0) this.attributes.speedX = -angularMaxSpeed;
            if (this.objectsBeneath.length === 0) this.attributes.speedY = angularMaxSpeed;
        } else if (!GameCreator.keys.keyUpPressed && !GameCreator.keys.keyRightPressed && !GameCreator.keys.keyDownPressed && GameCreator.keys.keyLeftPressed) {
            this.facing = 7;
            if (this.objectsLeft.length === 0) this.attributes.speedX = -maxSpeed;
            this.attributes.speedY = 0;
        } else if (GameCreator.keys.keyUpPressed && !GameCreator.keys.keyRightPressed && !GameCreator.keys.keyDownPressed && GameCreator.keys.keyLeftPressed) {
            this.facing = 8;
            if (this.objectsLeft.length === 0) this.attributes.speedX = -angularMaxSpeed;
            if (this.objectsAbove.length === 0) this.attributes.speedY = -angularMaxSpeed;
        } else {
            Math.abs(this.attributes.speedX) < 0.1 ? this.attributes.speedX = 0 : this.attributes.speedX *= 0.9;
            Math.abs(this.attributes.speedY) < 0.1 ? this.attributes.speedY = 0 : this.attributes.speedY *= 0.9;
        }
    };

    GameCreator.TopDownObject.prototype.onGameStarted = function() {
    };

    GameCreator.TopDownObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.attributes.accX = args.accX || [0];
        sceneObject.attributes.accY = args.accY || [0];
        sceneObject.attributes.speedX = args.speedX || [0];
        sceneObject.attributes.speedY = args.speedY || [0];

        sceneObject.facing = 1;

        sceneObject.attributes.maxSpeed = args.maxSpeed !== undefined ? args.maxSpeed : state.attributes.maxSpeed;
        sceneObject.keyCooldown = {space: false};
    };

    GameCreator.TopDownObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var objectToShoot = GameCreator.helpers.getGlobalObjectById(Number(staticParameters.objectToShoot));
        staticParameters.projectileSpeed = staticParameters.projectileSpeed || GameCreator.actions.Shoot.params.projectileSpeed.defaultValue;
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var angularSpeed = GameCreator.helpers.calcAngularSpeed(projectileSpeed);
        var facing = this.facing;
        var target, unitVector;
        
        var objectToShootAttributes = objectToShoot.getDefaultState().attributes;
        switch (staticParameters.projectileDirection) {
        case 'Default':
            switch (facing) {
            case 1:
                x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
                y = this.attributes.y - objectToShootAttributes.height;
                speedY = -projectileSpeed;
                break;
            case 2:
                x = this.attributes.x + this.attributes.width;
                y = this.attributes.y - objectToShootAttributes.height;
                speedX = angularSpeed;
                speedY = -angularSpeed;
                break;
            case 3:
                x = this.attributes.x + this.attributes.width;
                y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
                speedX = projectileSpeed;
                break;
            case 4:
                x = this.attributes.x + this.attributes.width;
                y = this.attributes.y + this.attributes.height;
                speedX = angularSpeed;
                speedY = angularSpeed;
                break;
            case 5:
                x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
                y = this.attributes.y + this.attributes.height;
                speedY = projectileSpeed;
                break;
            case 6:
                x = this.attributes.x - objectToShootAttributes.width;
                y = this.attributes.y + this.attributes.height;
                speedX = -angularSpeed;
                speedY = angularSpeed;
                break;
            case 7:
                x = this.attributes.x - objectToShootAttributes.width;
                y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
                speedX = -projectileSpeed;
                break;
            case 8:
                x = this.attributes.x - objectToShootAttributes.width;
                y = this.attributes.y - objectToShootAttributes.height;
                speedX = -angularSpeed;
                speedY = -angularSpeed;
                break;
            }
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
            target = GameCreator.getRuntimeObject(staticParameters.target);
            if (!target) {
                // We did not find the target, return without shooting anything.
                return;
            }
            x = this.attributes.x + this.attributes.width / 2 - objectToShootAttributes.width / 2;
            y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;;
            unitVector = GameCreator.helpers.calcUnitVector(target.attributes.x - this.attributes.x, target.attributes.y - this.attributes.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
            break;
        }
        GameCreator.createRuntimeObject(objectToShoot, {x: x, y: y, speedX: speedX, speedY: speedY});
    };
}());