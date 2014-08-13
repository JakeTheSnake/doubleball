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

        this.keyLeftPressed = false;
        this.keyRightPressed = false;
        this.keyUpPressed = false;
        this.keyDownPressed = false;

        this.getDefaultState().attributes.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? 300 : args.maxSpeed;
        
        this.objectType = "TopDownObject";
    };

    GameCreator.TopDownObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.TopDownObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.TopDownObject.objectAttributes = $.extend(GameCreator.TopDownObject.objectAttributes, {
        "maxSpeed": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.TopDownObject.objectSceneAttributes = $.extend({}, GameCreator.TopDownObject.objectAttributes);
    delete GameCreator.TopDownObject.objectSceneAttributes["image"];

    GameCreator.TopDownObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.TopDownObject.prototype);

    GameCreator.TopDownObject.prototype.initialize = function() {
        this.invalidated = true;
        this.speedY = GameCreator.helpers.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helpers.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helpers.getRandomFromRange(this.accY);
        this.accX = GameCreator.helpers.getRandomFromRange(this.accX);
        this.width = GameCreator.helpers.getRandomFromRange(this.width);
        this.height = GameCreator.helpers.getRandomFromRange(this.height);
        this.x = GameCreator.helpers.getRandomFromRange(this.x);
        this.y = GameCreator.helpers.getRandomFromRange(this.y);
    };

    GameCreator.TopDownObject.prototype.calculateSpeed = function() {
        var maxSpeed = this.maxSpeed;
        var angularMaxSpeed = GameCreator.helpers.calcAngularSpeed(maxSpeed);
        //Should only be able to affect movement if there is something beneath object.
        if (this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 1;
            this.speedX = 0;
            this.speedY = -maxSpeed;
        } else if (this.parent.keyUpPressed && this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 2;
            this.speedX = angularMaxSpeed;
            this.speedY = -angularMaxSpeed;
        } else if (!this.parent.keyUpPressed && this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 3;
            this.speedX = maxSpeed;
            this.speedY = 0;
        } else if (!this.parent.keyUpPressed && this.parent.keyRightPressed && this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 4;
            this.speedX = angularMaxSpeed;
            this.speedY = angularMaxSpeed;
        } else if (!this.parent.keyUpPressed && !this.parent.keyRightPressed && this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 5;
            this.speedX = 0;
            this.speedY = maxSpeed;
        } else if (!this.parent.keyUpPressed && !this.parent.keyRightPressed && this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 6;
            this.speedX = -angularMaxSpeed;
            this.speedY = angularMaxSpeed;
        } else if (!this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 7;
            this.speedX = -maxSpeed;
            this.speedY = 0;
        } else if (this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 8;
            this.speedX = -angularMaxSpeed;
            this.speedY = -angularMaxSpeed;
        } else {
            Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
            Math.abs(this.speedY) < 0.1 ? this.speedY = 0 : this.speedY *= 0.9;
        }
    };

    GameCreator.TopDownObject.prototype.onGameStarted = function() {
        var that = this;
        $(document).on("keydown.gameKeyListener", function(e) {
            switch (e.which) {
            case 32:
                that.keyPressed.space = true;
                break;
            case 37:
                that.keyLeftPressed = true;
                break;
            case 38:
                that.keyUpPressed = true;
                break;
            case 39:
                that.keyRightPressed = true;
                break;
            case 40:
                that.keyDownPressed = true;
                break;
            default:
                return;
            }
            e.preventDefault();
        });
        $(document).on("keyup.gameKeyListener", function(e) {
            switch (e.which) {
            case 32:
                that.keyPressed.space = false;
                break;
            case 37:
                that.keyLeftPressed = false;
                break;
            case 38:
                that.keyUpPressed = false;
                break;
            case 39:
                that.keyRightPressed = false;
                break;
            case 40:
                that.keyDownPressed = false;
                break;
            default:
                return;
            }
            e.preventDefault();
        });
    };

    GameCreator.TopDownObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.accX = args.accX || [0];
        sceneObject.accY = args.accY || [0];
        sceneObject.speedX = args.speedX || [0];
        sceneObject.speedY = args.speedY || [0];

        sceneObject.facing = 1;

        sceneObject.maxSpeed = args.maxSpeed !== undefined ? args.maxSpeed : state.attributes.maxSpeed;
        sceneObject.keyCooldown = {space: false};
    };

    GameCreator.TopDownObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var angularSpeed = GameCreator.helpers.calcAngularSpeed(projectileSpeed);
        var facing = this.facing;
        var target, unitVector;
        switch (staticParameters.projectileDirection) {
        case "Default":
            switch (facing) {
            case 1:
                x = this.x + this.width / 2;
                y = this.y;
                speedY = -projectileSpeed;
                break;
            case 2:
                x = this.x + this.width;
                y = this.y;
                speedX = angularSpeed;
                speedY = -angularSpeed;
                break;
            case 3:
                x = this.x + this.width;
                y = this.y + this.height / 2;
                speedX = projectileSpeed;
                break;
            case 4:
                x = this.x + this.width;
                y = this.y + this.height;
                speedX = angularSpeed;
                speedY = angularSpeed;
                break;
            case 5:
                x = this.x + this.width / 2;
                y = this.y + this.height;
                speedY = projectileSpeed;
                break;
            case 6:
                x = this.x;
                y = this.y + this.height;
                speedX = -angularSpeed;
                speedY = angularSpeed;
                break;
            case 7:
                x = this.x;
                y = this.y + this.height / 2;
                speedX = -projectileSpeed;
                break;
            case 8:
                x = this.x;
                y = this.y;
                speedX = -angularSpeed;
                speedY = -angularSpeed;
                break;
            }
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
            x = this.x + (this.facingLeft ? 0 : this.width);
            y = this.y;
            unitVector = GameCreator.helpers.calcUnitVector(target.x - this.x - (this.facingLeft ? 0 : this.width), target.y - this.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };
}());