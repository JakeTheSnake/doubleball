/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.PlatformObject = function(args) {
        GameCreator.addObjFunctions.commonObjectFunctions(this);
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.clickableObjectAttributes(this);
        
        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addCommonObjectControllers(this);
        }

        GameCreator.helpers.setStandardProperties(this, args);

        this.keyLeftPressed = false;
        this.keyRightPressed = false;
        this.keyUpPressed = false;

        this.getDefaultState().attributes.accY = (!args.accY && args.accY !== 0) ? [5] : args.accY;
        this.getDefaultState().attributes.acceleration = (!args.acceleration && args.acceleration !== 0) ? [8] : args.acceleration;
        this.getDefaultState().attributes.maxSpeed = (!args.maxSpeed && args.maxSpeed !== 0) ? [300] : args.maxSpeed;

        //Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.
        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;

        this.objectType = "PlatformObject";
    };

    GameCreator.PlatformObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.PlatformObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.PlatformObject.objectAttributes = $.extend(GameCreator.PlatformObject.objectAttributes, {
        "accY": GameCreator.htmlStrings.rangeInput,
        "acceleration": GameCreator.htmlStrings.rangeInput,
        "maxSpeed": GameCreator.htmlStrings.rangeInput
    });

    GameCreator.PlatformObject.objectSceneAttributes = $.extend({}, GameCreator.PlatformObject.objectAttributes);
    delete GameCreator.PlatformObject.objectSceneAttributes["image"];

    GameCreator.PlatformObject.prototype = Object.create(GameCreator.BaseObject.prototype);

    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.stoppableObjectFunctions(GameCreator.PlatformObject.prototype);
    GameCreator.addObjFunctions.bounceableObjectFunctions(GameCreator.PlatformObject.prototype);

    GameCreator.PlatformObject.prototype.calculateSpeed = function() {
        //Should only be able to affect movement if there is something beneath object.
        if (this.parent.keyUpPressed && this.objectBeneath) {
            this.attributes.speedY = -600;
        }
        if (this.parent.keyRightPressed) {
            this.facingLeft = false;
            this.attributes.accX = this.attributes.acceleration;
        } else if (this.parent.keyLeftPressed) {
            this.facingLeft = true;
            this.attributes.accX = -this.attributes.acceleration;
        } else if (this.objectBeneath) {
            this.attributes.accX = 0;
            Math.abs(this.speedX) < 0.1 ? this.attributes.speedX = 0 : this.attributes.speedX *= 0.9;
        } else {
            this.attributes.accX = 0;
        }
        //Add acceleration only if object is moving below max movement speed in that direction.
        if ((this.attributes.accX > 0 && this.attributes.speedX < this.attributes.maxSpeed) || (this.attributes.accX < 0 && this.attributes.speedX > -this.attributes.maxSpeed)) {
            this.attributes.speedX += this.attributes.accX;
        }
        this.attributes.speedY += this.attributes.accY;
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

        sceneObject.objectBeneath = false;
        sceneObject.attributes.acceleration = args.acceleration !== undefined ? args.acceleration : state.attributes.acceleration;

        sceneObject.attributes.accY = args.accY !== undefined ? args.accY : state.attributes.accY;

        sceneObject.attributes.maxSpeed = args.maxSpeed !== undefined ? args.maxSpeed : state.attributes.maxSpeed;
        sceneObject.keyCooldown = {space: false};
    };

    GameCreator.PlatformObject.prototype.shoot = function(staticParameters) {
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var target, unitVector;
        switch (staticParameters.projectileDirection) {
        case "Default":
            x = this.attributes.x + (this.facingLeft ? 0 : this.attributes.width);
            y = this.attributes.y;
            speedX = this.facingLeft ? -projectileSpeed : projectileSpeed;
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
            x = this.attributes.x + (this.facingLeft ? 0 : this.attributes.width);
            y = this.attributes.y;
            unitVector = GameCreator.helpers.calcUnitVector(target.attributes.x - this.attributes.x - (this.facingLeft ? 0 : this.attributes.width), target.attributes.y - this.attributes.y);
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
        }
        GameCreator.createRuntimeObject(GameCreator.helpers.findGlobalObjectById(Number(staticParameters.objectToShoot)), {x: x, y: y, speedX: speedX, speedY: speedY});
    };
}());

