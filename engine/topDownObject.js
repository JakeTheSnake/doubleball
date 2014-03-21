/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.TopDownObject = function(image, args) {
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);

        GameCreator.helperFunctions.setStandardProperties(this, image, args);

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;

        this.speedX = 0;
        this.speedY = 0;
        this.accX = 0;
        this.accY = 0;
        this.keyLeftPressed = false;
        this.keyRightPressed = false;
        this.keyUpPressed = false;
        this.keyDownPressed = false;
        this.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? 300 : args.maxSpeed;
        //Facing can be 1-8 where 1 is facing up and the others follow clockwise.
        this.facing = 1;
        //Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.

        this.objectType = "TopDownObject";
    };

    GameCreator.TopDownObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.TopDownObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.TopDownObject.prototype);

    GameCreator.TopDownObject.prototype.initialize = function() {
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

    GameCreator.TopDownObject.prototype.calculateSpeed = function() {
        var maxSpeed = this.maxSpeed;
        var angularMaxSpeed = GameCreator.helperFunctions.calcAngularSpeed(maxSpeed);
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

    GameCreator.TopDownObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var angularSpeed = GameCreator.helperFunctions.calcAngularSpeed(projectileSpeed);
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
            unitVector = GameCreator.helperFunctions.calcUnitVector(target.x - this.x - (this.facingLeft ? 0 : this.width), target.y - this.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };
}());