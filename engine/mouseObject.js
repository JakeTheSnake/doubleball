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
        this.isResizeable = true;

        this.getDefaultState().attributes.maxX = (!args.maxX && args.maxX !== 0) ? GameCreator.props.width : args.maxX;
        this.getDefaultState().attributes.maxY = (!args.maxY && args.maxY !== 0) ? GameCreator.props.height : args.maxY;
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

        // Recalculate x and y when the canvas has been resized (on mobile devices)
        this.attributes.x = (this.parent.latestMouseX / GameCreator.canvasSizeFactor) - offset.left;
        this.attributes.y = (this.parent.latestMouseY / GameCreator.canvasSizeFactor) - offset.top;

        if (this.attributes.x + this.attributes.width > this.attributes.maxX) {
            //This check is needed to prevent "flip-flopping" when the mousemove area is smaller than the object.
            if (this.attributes.maxX - this.attributes.minX >= this.attributes.width) {
                this.attributes.x = this.attributes.maxX - this.attributes.width;
            } else {
                this.attributes.x = this.attributes.maxX;
            }
        } else if (this.attributes.x < this.attributes.minX) {
            this.attributes.x = this.attributes.minX;
        }
        if (this.attributes.y + this.attributes.height > this.attributes.maxY) {
            if(this.attributes.maxY - this.attributes.minY >= this.attributes.height) {
                this.attributes.y = this.attributes.maxY - this.attributes.height;
            } else {
                this.attributes.y = this.attributes.maxY;
            }
        } else if (this.attributes.y < this.attributes.minY) {
            this.attributes.y = this.attributes.minY;
        }
    };

    GameCreator.MouseObject.prototype.onGameStarted = function() {
        var me = this;
        $(document).on("mousemove.gameKeyListener", function(evt) {
            me.latestMouseX = evt.pageX;
            me.latestMouseY = evt.pageY;
        });
    };

    GameCreator.MouseObject.prototype.objectEnteredGame = function() {
        $(GameCreator.mainCanvas).css("cursor", "none");
    };

    GameCreator.MouseObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.attributes.maxX = args.maxX !== undefined ? args.maxX : state.attributes.maxX;
        sceneObject.attributes.maxY = args.maxY !== undefined ? args.maxY : state.attributes.maxY;
        sceneObject.attributes.minX = args.minX !== undefined ? args.minX : state.attributes.minX;
        sceneObject.attributes.minY = args.minY !== undefined ? args.minY : state.attributes.minY;
        sceneObject.keyCooldown = {space: false};
    };

    GameCreator.MouseObject.prototype.getDefaultShootParameters = function(projectileSpeed, projectileAttributes) {
        var params = {};
        params.x = this.attributes.x + this.attributes.width / 2 - GameCreator.helpers.getRandomFromRange(projectileAttributes.width) / 2;
        params.y = this.attributes.y - GameCreator.helpers.getRandomFromRange(projectileAttributes.height);
        params.speedY = -projectileSpeed;
        params.speedX = 0;
        return params;
    };

    GameCreator.MouseObject.prototype.getProjectileOriginOffset = function() {
        var result = {};
        result.x = this.attributes.width / 2;
        result.y = this.attributes.height / 2;
        return result;
    };

    GameCreator.MouseObject.prototype.stop = function() {};

    GameCreator.MouseObject.prototype.onDestroy = function() {
        $(GameCreator.mainCanvas).off("mousemove." + this.objectName);
        this.runOnDestroyActions();
    };
}());
