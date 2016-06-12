/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.TopDownObject = function(args) {
        GameCreator.helpers.setStandardProperties(this, args);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);
        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addPlayerObjectControllers(this);
        }

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;
        this.isResizeable = true;

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
        if (window.isMobile()) {
            this.parent.calculateTouchSpeed.call(this);
        } else {
            this.parent.calculateKeyboardSpeed.call(this);
        }
    };

    GameCreator.TopDownObject.prototype.calculateKeyboardSpeed = function() {
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
            Math.abs(this.attributes.speedX) < 0.1 ? this.attributes.speedX = 0 : this.attributes.speedX *= 0.6;
            Math.abs(this.attributes.speedY) < 0.1 ? this.attributes.speedY = 0 : this.attributes.speedY *= 0.6;
        }  
    };

    GameCreator.TopDownObject.prototype.calculateTouchSpeed = function() {
        if (GameCreator.touch.isActive) {
            var x = this.attributes.x - GameCreator.vpOffsetX + this.attributes.width / 2;
            var y = this.attributes.y - GameCreator.vpOffsetY + this.attributes.height / 2;
            var vectorX = GameCreator.touch.x / GameCreator.canvasSizeFactor - x;
            var vectorY = GameCreator.touch.y / GameCreator.canvasSizeFactor - y;
            var distance = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2));

            this.attributes.speedX = vectorX * this.attributes.maxSpeed / distance;
            this.attributes.speedY = vectorY * this.attributes.maxSpeed / distance;
        } else {
            Math.abs(this.attributes.speedX) < 0.1 ? this.attributes.speedX = 0 : this.attributes.speedX *= 0.6;
            Math.abs(this.attributes.speedY) < 0.1 ? this.attributes.speedY = 0 : this.attributes.speedY *= 0.6;
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

        sceneObject.attributes.isControllingCamera = true;
    };

    GameCreator.TopDownObject.prototype.getDefaultShootParameters = function(projectileSpeed, projectileAttributes) {
        var params = {};
        var projectileWidth = GameCreator.helpers.getRandomFromRange(projectileAttributes.width);
        var projectileHeight = GameCreator.helpers.getRandomFromRange(projectileAttributes.height);
        var angularSpeed = GameCreator.helpers.calcAngularSpeed(projectileSpeed);
        switch (this.facing) {
            case 1:
                params.x = this.attributes.x + this.attributes.width / 2 - projectileWidth / 2;
                params.y = this.attributes.y - projectileHeight;
                params.speedY = -projectileSpeed;
                break;
            case 2:
                params.x = this.attributes.x + this.attributes.width;
                params.y = this.attributes.y - projectileHeight;
                params.speedX = angularSpeed;
                params.speedY = -angularSpeed;
                break;
            case 3:
                params.x = this.attributes.x + this.attributes.width;
                params.y = this.attributes.y + this.attributes.height / 2 - projectileHeight / 2;
                params.speedX = projectileSpeed;
                break;
            case 4:
                params.x = this.attributes.x + this.attributes.width;
                params.y = this.attributes.y + this.attributes.height;
                params.speedX = angularSpeed;
                params.speedY = angularSpeed;
                break;
            case 5:
                params.x = this.attributes.x + this.attributes.width / 2 - projectileWidth / 2;
                params.y = this.attributes.y + this.attributes.height;
                params.speedY = projectileSpeed;
                break;
            case 6:
                params.x = this.attributes.x - projectileWidth;
                params.y = this.attributes.y + this.attributes.height;
                params.speedX = -angularSpeed;
                params.speedY = angularSpeed;
                break;
            case 7:
                params.x = this.attributes.x - projectileWidth;
                params.y = this.attributes.y + this.attributes.height / 2 - projectileHeight / 2;
                params.speedX = -projectileSpeed;
                break;
            case 8:
                params.x = this.attributes.x - projectileWidth;
                params.y = this.attributes.y - projectileHeight;
                params.speedX = -angularSpeed;
                params.speedY = -angularSpeed;
                break;
        }
        return params;
    };

    GameCreator.TopDownObject.prototype.getProjectileOriginOffset = function(projectileAttributes) {
        var result = {};
        result.x = this.attributes.width / 2 - GameCreator.helpers.getRandomFromRange(projectileAttributes.width) / 2;
        result.y = this.attributes.height / 2 - GameCreator.helpers.getRandomFromRange(projectileAttributes.height) / 2;
        return result;
    };

}());
