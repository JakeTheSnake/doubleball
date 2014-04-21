/*global GameCreator, $, Image*/
(function() {
    "use strict";
    GameCreator.BaseObject = function() {
        this.image = undefined;
        this.width = 0;
        this.height = 0;
        this.imageReady = false;
        this.objectType = "baseObject";
        this.isDestroyed = false;
        this.isClickable = true;
        this.onDestroyEvents = [new GameCreator.Event()];
        this.onCreateEvents = [new GameCreator.Event()];
    };
        /**
         * Called when an object is being destroyed through an action. Marks
         * this object for imminent destruction and carries out onDestroy-actions.
         */
    GameCreator.BaseObject.prototype.destroy = function(params) {
        GameCreator.objectsToDestroy.push(this);
        if (params && Object.keys(GameCreator.effects.destroyEffects).indexOf(params.effect) != -1) {
            GameCreator.currentEffects.push(new GameCreator.effects[params.effect](this));
        }
        this.parent.onDestroy.call(this);
    };

    GameCreator.BaseObject.prototype.onDestroy = function() {
        this.parent.runOnDestroyActions.call(this);
    };

    GameCreator.BaseObject.prototype.runOnDestroyActions = function() {
        var i;
        if (!GameCreator.paused) {
            for (i = 0; i < this.parent.onDestroyEvents.length; i++) {
                var currEvent = this.parent.onDestroyEvents[i];
                if (currEvent.shouldOpenActionWindow()) {
                    currEvent.actionWindowAlreadyOpened = true;
                    GameCreator.UI.openEditActionsWindow(
                        "'" + this.parent.objectName + "' is has been destroyed!",
                        GameCreator.actionGroups.nonCollisionActions,
                        this.parent.onDestroyActions,
                        this.objectName
                    );
                    GameCreator.bufferedActions.push({actionArray: this.parent.onDestroyActions, runtimeObj: this});
                } else {
                    currEvent.runActions(this);
                }
            }
        }
    };

    GameCreator.BaseObject.prototype.onCreate = function() {
        this.parent.runOnCreateActions.call(this);
    };

    GameCreator.BaseObject.prototype.runOnCreateActions = function() {
        var i, index;
        if (!GameCreator.paused) {
            if (!this.parent.onCreateActions && GameCreator.state !== 'playing') {
                this.parent.onCreateActions = [];
                GameCreator.UI.openEditActionsWindow(
                    "'" + this.parent.objectName + "' has been created!",
                    GameCreator.actionGroups.nonCollisionActions,
                    this.parent.onCreateActions,
                    this.objectName
                );
                GameCreator.bufferedActions.push({actionArray: this.parent.onCreateActions, runtimeObj: this});
            }
            if (this.parent.onCreateActions) {
                for (i = 0; i < this.parent.onCreateActions.length; i += 1) {
                    this.parent.onCreateActions[i].runAction(this);
                }
            }
            index = GameCreator.newlyCreatedObjects.indexOf(this);
            if (index !== -1) {
                GameCreator.newlyCreatedObjects.splice(index, 1);
            }
        }
    };

    GameCreator.BaseObject.prototype.removeFromGame = function() {
        GameCreator.invalidate(this);
        GameCreator.helperFunctions.removeObjectFromArrayById(
            GameCreator.helperFunctions.getObjectById(GameCreator.collidableObjects, this.parent.id).runtimeObjects,
            this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.movableObjects, this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.renderableObjects, this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.eventableObjects, this.instanceId);
        var index = GameCreator.objectsToDestroy.indexOf(this);
        if (index !== -1) {
            GameCreator.objectsToDestroy.splice(index, 1);
        }
        this.isDestroyed = true;
    };

    GameCreator.BaseObject.prototype.onGameStarted = function() {};

    GameCreator.BaseObject.prototype.checkEvents = function() {};

    GameCreator.BaseObject.prototype.move = function(modifier) {
        if (this.speedX !== 0 || this.speedY !== 0) {
            GameCreator.invalidate(this);
            this.x += this.speedX * modifier;
            this.y += this.speedY * modifier;
        }
    };

    GameCreator.BaseObject.prototype.draw = function(context, obj) {
        if (obj.parent.imageReady) {
            if (Array.isArray(obj.width) || Array.isArray(obj.height)) {
                var maxHeight, minHeight, maxWidth, minWidth;
                if (obj.width.length === 2) {
                    maxWidth = obj.width[1];
                    minWidth = obj.width[0];
                } else if (obj.width.length === 1) {
                    maxWidth = obj.width[0];
                    minWidth = obj.width[0];
                } else {
                    maxWidth = obj.width;
                    minWidth = obj.width;
                }
                if (obj.height.length === 2) {
                    maxHeight = obj.height[1];
                    minHeight = obj.height[0];
                } else if (obj.height.length === 1) {
                    maxHeight = obj.height[0];
                    minHeight = obj.height[0];
                } else {
                    maxHeight = obj.height;
                    minHeight = obj.height;
                }
                context.globalAlpha = 0.5;
                context.drawImage(obj.parent.image, obj.x, obj.y, maxWidth, maxHeight);
                context.globalAlpha = 1.0;
                context.drawImage(obj.parent.image, obj.x, obj.y, minWidth, minHeight);
            } else {
                context.drawImage(obj.parent.image, obj.x, obj.y, obj.width, obj.height);
            }
            obj.invalidated = false;
        }
    };

    GameCreator.BaseObject.createFromSaved = function(savedObject) {
        var image = new Image();
        var obj = new GameCreator[savedObject.objectType](image, {});
        var name;
        image.src = savedObject.imageSrc;
        obj.image = image;

        image.onload = function() {
            obj.imageReady = true;
            GameCreator.render();
        };

        for (name in savedObject) {
            if (savedObject.hasOwnProperty(name)) {
                obj[name] = savedObject[name];
            }
        }

        GameCreator.globalObjects[obj.objectName] = obj;

        return obj;
    };
}());
