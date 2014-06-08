/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.MouseObject = function(args) {
        GameCreator.addObjFunctions.collidableObjectAttributes(this);
        GameCreator.addObjFunctions.keyObjectAttributes(this);
        GameCreator.addObjFunctions.commonObjectFunctions(this);

        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectViews.addPlayerObjectViews(this);
            GameCreator.commonObjectControllers.addPlayerObjectControllers(this);
        }

        GameCreator.helpers.setStandardProperties(this, args);

        this.isCollidable = true;
        this.isMovable = true;
        this.isRenderable = true;
        this.isEventable = true;
        this.latestMouseX = 0;
        this.latestMouseY = 0;

        this.getDefaultState().attributes.maxX = (!args.maxX && args.maxX !== 0) ? GameCreator.width : args.maxX;
        this.getDefaultState().attributes.maxY = (!args.maxY && args.maxY !== 0) ? GameCreator.height : args.maxY;
        this.getDefaultState().attributes.minX = args.minX || 0;
        this.getDefaultState().attributes.minY = args.minY || 0;

        this.objectType = "MouseObject";
    };

    GameCreator.MouseObject.objectAttributes = GameCreator.helpers.getStandardAttributes();

    GameCreator.MouseObject.objectAttributes = $.extend(GameCreator.MouseObject.objectAttributes, {
        "maxX": GameCreator.htmlStrings.numberInput,
        "maxY": GameCreator.htmlStrings.numberInput,
        "minY": GameCreator.htmlStrings.numberInput,
        "minX": GameCreator.htmlStrings.numberInput
    });

    GameCreator.MouseObject.objectSceneAttributes = $.extend({}, GameCreator.MouseObject.objectAttributes);
    delete GameCreator.MouseObject.objectSceneAttributes["image"];

    GameCreator.MouseObject.prototype = Object.create(GameCreator.BaseObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.MouseObject.prototype);

    GameCreator.MouseObject.prototype.initialize = function() {
        this.width = GameCreator.helpers.getRandomFromRange(this.width);
        this.height = GameCreator.helpers.getRandomFromRange(this.height);
        this.x = GameCreator.helpers.getRandomFromRange(this.x);
        this.y = GameCreator.helpers.getRandomFromRange(this.y);
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

    GameCreator.MouseObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.maxX = args.maxX !== undefined ? args.maxX : state.attributes.maxX;
        sceneObject.maxY = args.maxY !== undefined ? args.maxY : state.attributes.maxY;
        sceneObject.minX = args.minX !== undefined ? args.minX : state.attributes.minX;
        sceneObject.minY = args.minY !== undefined ? args.minY : state.attributes.minY;
    };

    GameCreator.MouseObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
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
            unitVector = GameCreator.helpers.calcUnitVector(target.x - (this.x + this.width / 2), target.y - (this.y + this.height / 2));
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