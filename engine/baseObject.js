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
        if (params && GameCreator.effects.hasOwnProperty(params.effect)) {
            GameCreator.currentEffects.push(new GameCreator.effects[params.effect](this));
        }
        this.parent.onDestroy.call(this);
    };

    GameCreator.BaseObject.prototype.onDestroy = function() {
        this.parent.runOnDestroyActions.call(this);
    };

    GameCreator.BaseObject.prototype.runOnDestroyActions = function() {
        var currentSet, globalObj = this.parent;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && globalObj.events.onDestroySets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                globalObj.events.onDestroySets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    GameCreator.htmlStrings.defaultEventInformationWindow("'" + globalObj.objectName + "' has been destroyed!", this.getCurrentImage().src),
                    currentSet, 'destroy', globalObj.objectName
                );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: this});
            } else {
                GameCreator.helpers.runEventActions(globalObj.events.onDestroySets, this);
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
        var globalObj = this.parent;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && globalObj.events.onCreateSets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                globalObj.events.onCreateSets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    GameCreator.htmlStrings.defaultEventInformationWindow("'" + globalObj.objectName + "' has been created!", this.getCurrentImage().src),
                    currentSet, 'create', globalObj.objectName
                );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: this});
            } else {
                GameCreator.helpers.runEventActions(globalObj.events.onCreateSets, this);
            }
        }
    };

    GameCreator.BaseObject.prototype.runOnClickActions = function() {
        var i, currentSet;
        var globalObj = this.parent;
        if (!GameCreator.paused) {
            if (GameCreator.state === 'directing' && globalObj.events.onClickSets.length === 0) {
                currentSet = new GameCreator.ConditionActionSet();
                globalObj.events.onClickSets.push(currentSet);
                GameCreator.UI.openEditActionsWindow(
                    GameCreator.htmlStrings.defaultEventInformationWindow("Clicked on " + globalObj.objectName, this.getCurrentImage().src),
                     currentSet, 'click', globalObj.objectName
                    );
                GameCreator.bufferedActions.push({actionArray: currentSet.actions, runtimeObj: this});
            } else {
                GameCreator.helpers.runEventActions(globalObj.events.onClickSets, this);
            }                  
        }
    };

    GameCreator.BaseObject.prototype.removeFromGame = function() {
        var collidableObjectsCollection = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, this.parent.id);
        GameCreator.invalidate(this);
        if (collidableObjectsCollection) {
            GameCreator.helpers.removeObjectFromArrayByInstanceId(
                collidableObjectsCollection.runtimeObjects,
                this.attributes.instanceId);
            if (collidableObjectsCollection.runtimeObjects.length === 0) {
                GameCreator.helpers.removeObjectFromArrayById(
                    GameCreator.collidableObjects,
                    this.parent.id);
            }
        }
        GameCreator.helpers.removeObjectFromArrayByInstanceId(GameCreator.movableObjects, this.attributes.instanceId);
        GameCreator.helpers.removeObjectFromArrayByInstanceId(GameCreator.renderableObjects, this.attributes.instanceId);
        GameCreator.helpers.removeObjectFromArrayByInstanceId(GameCreator.eventableObjects, this.attributes.instanceId);
        var index = GameCreator.objectsToDestroy.indexOf(this);
        if (index !== -1) {
            GameCreator.objectsToDestroy.splice(index, 1);
        }
        var instances;
        for(var i = 0; i < GameCreator.collidableObjects.length; i += 1) {
            instances = GameCreator.collidableObjects[i].runtimeObjects;
            for(var j = 0; j < instances.length; j += 1) {
                instances[j].removeFromCollidingList(this.attributes.instanceId);
            }
        }
        this.isDestroyed = true;
    };

    GameCreator.BaseObject.prototype.onGameStarted = function() {};

    GameCreator.BaseObject.prototype.objectEnteredGame = function() {};

    GameCreator.BaseObject.prototype.checkEvents = function() {};

    GameCreator.BaseObject.prototype.move = function(modifier) {
        if (this.attributes.speedX > 0) {
            if (this.objectsRight.length === 0) {
                this.attributes.x += this.attributes.speedX * modifier;
            }
        } else {
            if (this.objectsLeft.length === 0) {
                this.attributes.x += this.attributes.speedX * modifier;
            }
        }
        if (this.attributes.speedY > 0) {
            if (this.objectsBeneath.length === 0) {
                this.attributes.y += this.attributes.speedY * modifier;
            }
        } else {
            if (this.objectsAbove.length === 0) {
                this.attributes.y += this.attributes.speedY * modifier;
            }
        }
    };

    GameCreator.BaseObject.prototype.setPosition = function(parameters) {
        if (parameters.type === 'absolute') {
            this.attributes.x = GameCreator.helpers.getRandomFromRange(parameters.x);
            this.attributes.y = GameCreator.helpers.getRandomFromRange(parameters.y);
        } else if (parameters.type === 'relative') {
            this.attributes.x += GameCreator.helpers.getRandomFromRange(parameters.x);
            this.attributes.y += GameCreator.helpers.getRandomFromRange(parameters.y);
        }
    };

    GameCreator.BaseObject.prototype.draw = function(context, obj) {
        var image = obj.getCurrentImage() || obj.parent.getDefaultState().attributes.image;
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
                GameCreator.drawImage(context, image, obj.attributes.x, obj.attributes.y, obj.attributes.width, obj.attributes.height, obj.attributes.isControllingCamera);
            }
            obj.invalidated = false;
        }
    };
}());
