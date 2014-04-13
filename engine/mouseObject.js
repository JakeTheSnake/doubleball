/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.MouseObject = function(image, args) {
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);

        GameCreator.helperFunctions.setStandardProperties(this, image, args);

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;
        this.latestMouseX = 0;
        this.latestMouseY = 0;
        this.maxX = (!args.maxX && args.maxX !== 0) ? GameCreator.width : args.maxX;
        this.maxY = (!args.maxY && args.maxY !== 0) ? GameCreator.height : args.maxY;
        this.minX = args.minX || 0;
        this.minY = args.minY || 0;

        this.objectType = "MouseObject";
    };

    GameCreator.MouseObject.prototype = Object.create(GameCreator.BaseObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.MouseObject.prototype);

    GameCreator.MouseObject.prototype.initialize = function() {
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
        this.x = GameCreator.helperFunctions.getRandomFromRange(this.x);
        this.y = GameCreator.helperFunctions.getRandomFromRange(this.y);
    };

    GameCreator.MouseObject.prototype.move = function() {
        GameCreator.invalidate(this);
        var offset = $(GameCreator.mainCanvas).offset();
        this.x = this.parent.latestMouseX - offset.left;
        this.y = this.parent.latestMouseY - offset.top;
        if (this.x > this.maxX) {
            this.x = this.maxX;
        } else if (this.x < this.minX) {
            this.x = this.minX;
        }
        if (this.y > this.maxY) {
            this.y = this.maxY;
        } else if (this.y < this.minY) {
            this.y = this.minY;
        }
    };

    GameCreator.MouseObject.prototype.onGameStarted = function() {
        $(GameCreator.mainCanvas).css("cursor", "none");
        var that = this;
        $(document).on("mousemove.gameKeyListener", function(evt) {
            that.latestMouseX = evt.pageX;
            that.latestMouseY = evt.pageY;
        });
        $(document).on("mousedown.gameKeyListener", function(e) {
            switch (e.which) {
            case 1:
                that.keyPressed.leftMouse = true;
                break;
            case 3:
                that.keyPressed.rightMouse = true;
                break;
            default:
                return;
            }
            e.preventDefault();
        });
        $(document).on("mouseup.gameKeyListener", function(e) {
            switch (e.which) {
            case 1:
                that.keyPressed.leftMouse = false;
                break;
            case 3:
                that.keyPressed.rightMouse = false;
                break;
            default:
                return;
            }
            e.preventDefault();
        });
    };

    GameCreator.MouseObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var target, unitVector;
        switch (staticParameters.projectileDirection) {
        case "Default":
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
            unitVector = GameCreator.helperFunctions.calcUnitVector(target.x - (this.x + this.width / 2), target.y - (this.y + this.height / 2));
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
            break;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };

    GameCreator.MouseObject.prototype.onDestroy = function() {
        $(GameCreator.mainCanvas).off("mousemove." + this.objectName);
        this.runOnDestroyActions();
    };
}());