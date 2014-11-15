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

    GameCreator.MouseObject.objectNonStateAttributes = GameCreator.helpers.getStandardNonStateAttributes();

    GameCreator.MouseObject.objectAttributes = $.extend(GameCreator.MouseObject.objectAttributes, {
        "maxX": GameCreator.htmlStrings.numberInput,
        "maxY": GameCreator.htmlStrings.numberInput,
        "minY": GameCreator.htmlStrings.numberInput,
        "minX": GameCreator.htmlStrings.numberInput
    });

    GameCreator.MouseObject.prototype = Object.create(GameCreator.BaseObject.prototype);
    GameCreator.addObjFunctions.keyObjectFunctions(GameCreator.MouseObject.prototype);

    GameCreator.MouseObject.prototype.initialize = function() {
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
        this.attributes.x = GameCreator.helpers.getRandomFromRange(this.attributes.x);
        this.attributes.y = GameCreator.helpers.getRandomFromRange(this.attributes.y);
    };

    GameCreator.MouseObject.prototype.move = function() {
        GameCreator.invalidate(this);
        var offset = $(GameCreator.mainCanvas).offset();
        this.attributes.x = this.parent.latestMouseX - offset.left;
        this.attributes.y = this.parent.latestMouseY - offset.top;
        if (this.attributes.x + this.attributes.width > this.attributes.maxX) {
            this.attributes.x = this.attributes.maxX - this.attributes.width;
        } else if (this.attributes.x < this.attributes.minX) {
            this.attributes.x = this.attributes.minX;
        }
        if (this.attributes.y + this.attributes.height > this.attributes.maxY) {
            this.attributes.y = this.attributes.maxY - this.attributes.height;
        } else if (this.attributes.y < this.attributes.minY) {
            this.attributes.y = this.attributes.minY;
        }
    };

    GameCreator.MouseObject.prototype.onGameStarted = function() {
        $(GameCreator.mainCanvas).css("cursor", "none");
        var that = this;
        $(document).on("mousemove.gameKeyListener", function(evt) {
            that.latestMouseX = evt.pageX;
            that.latestMouseY = evt.pageY;
        });
        this.initializeKeyListeners();
    };

    GameCreator.MouseObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.attributes.maxX = args.maxX !== undefined ? args.maxX : state.attributes.maxX;
        sceneObject.attributes.maxY = args.maxY !== undefined ? args.maxY : state.attributes.maxY;
        sceneObject.attributes.minX = args.minX !== undefined ? args.minX : state.attributes.minX;
        sceneObject.attributes.minY = args.minY !== undefined ? args.minY : state.attributes.minY;
        sceneObject.keyCooldown = {space: false};
    };

    GameCreator.MouseObject.prototype.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helpers.getRandomFromRange(staticParameters.projectileSpeed);
        var target, unitVector;
        var objectToShoot = GameCreator.helpers.findGlobalObjectById(Number(staticParameters.objectToShoot));
        var objectToShootAttributes = objectToShoot.getDefaultState().attributes;
        switch (staticParameters.projectileDirection) {
        case 'Default':
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
            y = this.attributes.y + this.attributes.height / 2 - objectToShootAttributes.height / 2;
            unitVector = GameCreator.helpers.calcUnitVector(target.attributes.x - (this.attributes.x + this.attributes.width / 2), target.attributes.y - (this.attributes.y + this.attributes.height / 2));
            speedX = unitVector.x * projectileSpeed;
            speedY = unitVector.y * projectileSpeed;
            break;
        }
        GameCreator.createRuntimeObject(objectToShoot, {x: x, y: y, speedX: speedX, speedY: speedY});
    };

    GameCreator.MouseObject.prototype.onDestroy = function() {
        $(GameCreator.mainCanvas).off("mousemove." + this.objectName);
        this.runOnDestroyActions();
    };
}());