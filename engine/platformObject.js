/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.PlatformObject = function(image, args) {
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);
        
        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addCommonObjectControllers(this);
        }

        GameCreator.helperFunctions.setStandardProperties(this, image, args);

        this.accX = [0];
        this.accY = (!args.accY && args.accY !== 0) ? [5] : args.accY;
        this.acceleration = (!args.acceleration && args.acceleration !== 0) ? [8] : args.acceleration;
        this.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? [300] : args.maxSpeed;
        this.keyLeftPressed = false;
        this.keyRightPressed = false;
        this.keyUpPressed = false;
        this.speedX = [0];
        this.speedY = [0];

        //Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.
        this.facingLeft = true;
        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;

        this.objectType = "PlatformObject";
    };

    GameCreator.PlatformObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.PlatformObject.prototype);

    GameCreator.PlatformObject.prototype.calculateSpeed = function() {
        //Should only be able to affect movement if there is something beneath object.
        if (this.parent.keyUpPressed && this.objectBeneath) {
            this.speedY = -600;
        }
        if (this.parent.keyRightPressed) {
            this.facingLeft = false;
            this.accX = this.acceleration;
        } else if (this.parent.keyLeftPressed) {
            this.facingLeft = true;
            this.accX = -this.acceleration;
        } else if (this.objectBeneath) {
            this.accX = 0;
            Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
        } else {
            this.accX = 0;
        }
        //Add acceleration only if object is moving below max movement speed in that direction.
        if ((this.accX > 0 && this.speedX < this.maxSpeed) || (this.accX < 0 && this.speedX > -this.maxSpeed)) {
            this.speedX += this.accX;
        }
        this.speedY += this.accY;
    };

    GameCreator.PlatformObject.prototype.onGameStarted = function() {
        var that = this;
        $(document).on("keydown.gameKeyListener", function(e) {
            switch (e.which) {
            case 32:
                that.keyPressed.space = true;
                break;
            case 37:
                that.keyLeftPressed = true;
                break;
            case 39:
                that.keyRightPressed = true;
                break;
            case 38:
                that.keyUpPressed = true;
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
            case 39:
                that.keyRightPressed = false;
                break;
            case 38:
                that.keyUpPressed = false;
                break;
            default:
                return;
            }
            e.preventDefault();
        });
    };

    GameCreator.PlatformObject.prototype.initialize = function() {
        this.invalidated = true;
        this.speedY = GameCreator.helperFunctions.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helperFunctions.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helperFunctions.getRandomFromRange(this.accY);
        this.accX = GameCreator.helperFunctions.getRandomFromRange(this.accX);
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
        this.acceleration = GameCreator.helperFunctions.getRandomFromRange(this.acceleration);
        this.maxSpeed = GameCreator.helperFunctions.getRandomFromRange(this.maxSpeed);
        this.x = GameCreator.helperFunctions.getRandomFromRange(this.x);
        this.y = GameCreator.helperFunctions.getRandomFromRange(this.y);
    };

    GameCreator.PlatformObject.prototype.shoot = function(staticParameters) {
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var target, unitVector;
        switch (staticParameters.projectileDirection) {
        case "Default":
            x = this.x + (this.facingLeft ? 0 : this.width);
            y = this.y;
            speedX = this.facingLeft ? -projectileSpeed : projectileSpeed;
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

