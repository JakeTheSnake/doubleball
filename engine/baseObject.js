/*global GameCreator, $, Image*/
(function() {
    "use strict";
    GameCreator.BaseObject = function() {
        this.objectType = "baseObject";
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
        var i, currentSet;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && this.parent.onDestroySets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                this.parent.onDestroySets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    "'" + this.parent.objectName + "' has been destroyed!",
                    GameCreator.helpers.getNonCollisionActions(this.objectType),
                    currentSet.actions,
                    this.objectName
                );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: this});
            } else {
                for (i = 0; i < this.parent.onDestroySets.length; i++) {
                    currentSet = this.parent.onDestroySets[i];
                    if (currentSet.checkConditions()) {
                        currentSet.runActions(this);
                    }
                }
            }
        }
    };

    GameCreator.BaseObject.prototype.onCreate = function() {
        var index;
        this.parent.runOnCreateActions.call(this);
        index = GameCreator.newlyCreatedObjects.indexOf(this);
        if (index !== -1) {
            GameCreator.newlyCreatedObjects.splice(index, 1);
        }
    };

    GameCreator.BaseObject.prototype.runOnCreateActions = function() {
        var i, currentSet;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && this.parent.onCreateSets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                this.parent.onCreateSets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    "'" + this.parent.objectName + "' has been created!",
                    GameCreator.helpers.getNonCollisionActions(this.objectType),
                    currentSet.actions,
                    this.objectName
                );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: this});
            } else {
                for (i = 0; i < this.parent.onCreateSets.length; i++) {
                    currentSet = this.parent.onCreateSets[i];
                    if (currentSet.checkConditions()) {
                        currentSet.runActions(this);
                    }
                }
            }
        }
    };

    GameCreator.BaseObject.prototype.runOnClickActions = function() {
        var i, currentSet;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && this.parent.onClickSets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                this.parent.onClickSets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    "Clicked on " + this.parent.objectName,
                     GameCreator.helpers.getNonCollisionActions(this.objectType),
                     currentSet.actions,
                     this.parent.objectName
                    );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: runtimeObj});
            } else {
                for (i = 0; i < this.parent.onClickSets.length; i++) {
                    currentSet = this.parent.onClickSets[i];
                    if (currentSet.checkConditions()) {
                        currentSet.runActions(runtimeObj);
                    }
                }
            }                  
        }
    };

    GameCreator.BaseObject.prototype.removeFromGame = function() {
        GameCreator.invalidate(this);
        GameCreator.helpers.removeObjectFromArrayById(
            GameCreator.helpers.getObjectById(GameCreator.collidableObjects, this.parent.id).runtimeObjects,
            this.instanceId);
        GameCreator.helpers.removeObjectFromArrayById(GameCreator.movableObjects, this.instanceId);
        GameCreator.helpers.removeObjectFromArrayById(GameCreator.renderableObjects, this.instanceId);
        GameCreator.helpers.removeObjectFromArrayById(GameCreator.eventableObjects, this.instanceId);
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
        var image = obj.image;
        if ($(image).data('loaded')) {
            if (Array.isArray(obj.attributes.width) || Array.isArray(obj.attributes.height)) {
                var maxHeight, minHeight, maxWidth, minWidth;
                if (obj.attributes.width.length === 2) {
                    maxWidth = obj.attributes.width[1];
                    minWidth = obj.attributes.width[0];
                } else if (obj.attributes.width.length === 1) {
                    maxWidth = obj.attributes.width[0];
                    minWidth = obj.attributes.width[0];
                } else {
                    maxWidth = obj.attributes.width;
                    minWidth = obj.attributes.width;
                }
                if (obj.attributes.height.length === 2) {
                    maxHeight = obj.attributes.height[1];
                    minHeight = obj.attributes.height[0];
                } else if (obj.attributes.height.length === 1) {
                    maxHeight = obj.attributes.height[0];
                    minHeight = obj.attributes.height[0];
                } else {
                    maxHeight = obj.attributes.height;
                    minHeight = obj.attributes.height;
                }
                context.globalAlpha = 0.5;
                context.drawImage(image, obj.attributes.x, obj.attributes.y, maxWidth, maxHeight);
                context.globalAlpha = 1.0;
                context.drawImage(image, obj.attributes.x, obj.attributes.y, minWidth, minHeight);
            } else {
                context.drawImage(image, obj.attributes.x, obj.attributes.y, obj.attributes.width, obj.attributes.height);
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
