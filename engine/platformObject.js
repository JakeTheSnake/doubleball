/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.PlatformObject = function(args) {
        GameCreator.helpers.setStandardProperties(this, args);
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);
        
        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addPlayerObjectControllers(this);
        }


        this.getDefaultState().attributes.accY = (!args.accY && args.accY !== 0) ? [10] : args.accY;
        this.getDefaultState().attributes.acceleration = (!args.acceleration && args.acceleration !== 0) ? [8] : args.acceleration;
        this.getDefaultState().attributes.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? [300] : args.maxSpeed;

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;
        this.isResizeable = true;

        this.objectType = "PlatformObject";
    };

    GameCreator.PlatformObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.PlatformObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.PlatformObject.objectAttributes = $.extend(GameCreator.PlatformObject.objectAttributes, {
        "accY": GameCreator.htmlStrings.rangeInput,
        "acceleration": GameCreator.htmlStrings.rangeInput,
        "maxSpeed": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.PlatformObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.PlatformObject.prototype);

    GameCreator.PlatformObject.prototype.calculateSpeed = function() {
        //Should only be able to affect movement if there is something beneath object.
        if (GameCreator.keys.keyUpPressed && this.objectsBeneath.length > 0) {
            this.attributes.speedY = -600;
        }
        if (GameCreator.keys.keyRightPressed) {
            this.facingLeft = false;
            if (this.objectsRight.length === 0) {
                this.attributes.accX = this.attributes.acceleration;
            }
        } else if (GameCreator.keys.keyLeftPressed) {
            this.facingLeft = true;
            if (this.objectsLeft.length === 0) {
                this.attributes.accX = -this.attributes.acceleration;
            }
        } else if (this.objectsBeneath.length > 0) {
            this.attributes.accX = 0;
            Math.abs(this.speedX) < 0.1 ? this.attributes.speedX = 0 : this.attributes.speedX *= 0.9;
        } else {
            this.attributes.accX = 0;
        }
        //Add acceleration only if object is moving below max movement speed in that direction.
        if ((this.attributes.accX > 0 && this.attributes.speedX < this.attributes.maxSpeed) || (this.attributes.accX < 0 && this.attributes.speedX > -this.attributes.maxSpeed)) {
            if (this.attributes.accX > 0) {
                if (this.objectsRight.length === 0) this.attributes.speedX += this.attributes.accX;
            } else {
                if (this.objectsLeft.length === 0) this.attributes.speedX += this.attributes.accX;
            }
        }
        if (this.attributes.accY > 0) {
            if (this.objectsBeneath.length === 0) this.attributes.speedY += this.attributes.accY;
        } else {
            if (this.objectsAbove.length === 0) this.attributes.speedY += this.attributes.accY;
        }
    };

    GameCreator.PlatformObject.prototype.onGameStarted = function() {
    };

    GameCreator.PlatformObject.prototype.initialize = function() {
        this.invalidated = true;
        this.attributes.speedY = GameCreator.helpers.getRandomFromRange(this.attributes.speedY);
        this.attributes.speedX = GameCreator.helpers.getRandomFromRange(this.attributes.speedX);
        this.attributes.accY = GameCreator.helpers.getRandomFromRange(this.attributes.accY);
        this.attributes.accX = GameCreator.helpers.getRandomFromRange(this.attributes.accX);
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
        this.attributes.acceleration = GameCreator.helpers.getRandomFromRange(this.attributes.acceleration);
        this.attributes.maxSpeed = GameCreator.helpers.getRandomFromRange(this.attributes.maxSpeed);
        this.attributes.x = GameCreator.helpers.getRandomFromRange(this.attributes.x);
        this.attributes.y = GameCreator.helpers.getRandomFromRange(this.attributes.y);
    };

    GameCreator.PlatformObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.attributes.accX = args.accX || [0];
        sceneObject.attributes.speedX = args.speedX || [0];
        sceneObject.attributes.speedY = args.speedY || [0];

        sceneObject.objectsBeneath = [];
        sceneObject.objectsAbove = [];
        sceneObject.objectsLeft = [];
        sceneObject.objectsRight = [];

        sceneObject.attributes.acceleration = args.acceleration !== undefined ? args.acceleration : state.attributes.acceleration;

        sceneObject.attributes.accY = args.accY !== undefined ? args.accY : state.attributes.accY;

        sceneObject.attributes.maxSpeed = args.maxSpeed !== undefined ? args.maxSpeed : state.attributes.maxSpeed;
        sceneObject.keyCooldown = {space: false};

        sceneObject.attributes.isControllingCamera = true;
    };

    GameCreator.PlatformObject.prototype.getDefaultShootParameters = function(projectileSpeed, projectileAttributes) {
        var params = {};
        params.x = this.attributes.x + (this.facingLeft ? -GameCreator.helpers.getRandomFromRange(projectileAttributes.width) : this.attributes.width);
        params.y = this.attributes.y;
        params.speedX = this.facingLeft ? -projectileSpeed : projectileSpeed;
        params.speedY = 0;
        return params;
    };

    GameCreator.PlatformObject.prototype.getProjectileOriginOffset = function() {
        var result = {};
        result.x = (this.facingLeft ? 0 : this.attributes.width);
        result.y = 0;
        return result;
    };

}());

