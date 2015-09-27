/*global GameCreator, $, setTimeout*/
(function() {
    "use strict";

    GameCreator.addObjFunctions.commonObjectFunctions = function(object) {
        object.getDefaultState = GameCreator.commonObjectFunctions.getDefaultState;
        object.getState = GameCreator.commonObjectFunctions.getState;
        object.isShootable = GameCreator.commonObjectFunctions.isShootable;
        object.createState = GameCreator.commonObjectFunctions.createState;
        object.removeAttributeFromState = GameCreator.commonObjectFunctions.removeAttributeFromState;
        object.resetStateAttributes = GameCreator.commonObjectFunctions.resetStateAttributes;
    }

    GameCreator.addObjFunctions.bounceableObjectFunctions = function(object) {
        object.bounce = function(params) {
            if (!params.collisionObject) {
                throw GameCreator.errors.BounceActionNoCollisionObject;
            }
            switch (GameCreator.helpers.determineQuadrant(params.collisionObject, this)) {
            case 1:
                this.attributes.speedY = -Math.abs(this.attributes.speedY);
                break;
            case 2:
                this.attributes.speedX = Math.abs(this.attributes.speedX);
                break;
            case 3:
                this.attributes.speedY = Math.abs(this.attributes.speedY);
                break;
            case 4:
                this.attributes.speedX = -Math.abs(this.attributes.speedX);
                break;
            }
        };
    };

    GameCreator.addObjFunctions.collidableObjectAttributes = function(object) {
        object.onCollideSets = [];
    };

    GameCreator.addObjFunctions.keyObjectAttributes = function(object) {
        object.onKeySets = {
            shift: [],
            ctrl: [],
            alt: [],
            space: [],
            leftMouse: [],
            rightMouse: [],
        };
    };

    GameCreator.addObjFunctions.keyObjectFunctions = function(object) {
        object.checkEvents = function() {
            var j, key, isKeyPressed, keySets, actions;
            var globalObj = this.parent;
            //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
            for (key in GameCreator.keys.keyPressed) {
                if (GameCreator.keys.keyPressed.hasOwnProperty(key)) {
                    isKeyPressed = GameCreator.keys.keyPressed[key];
                    keySets = globalObj.onKeySets[key];

                    if (isKeyPressed && !this.keyCooldown[key]) {
                        if (GameCreator.state === 'directing' && keySets.length === 0) {
                            keySets.push(new GameCreator.ConditionActionSet());
                            actions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
                            GameCreator.UI.openEditActionsWindow(
                                GameCreator.htmlStrings.defaultEventInformationWindow("Pressed " + key + " actions for " + globalObj.objectName, this.getCurrentImage().src),
                                    keySets[0], 'key', globalObj.objectName
                                );
                            GameCreator.bufferedActions.push({actionArray: keySets[0].actions, runtimeObj: this});    
                        } else {
                            var conditionPassedCallback = function(){
                                this.keyCooldown[key] = true;
                                    
                                setTimeout(function(cooldowns, cooldown) {
                                    cooldowns[cooldown] = false; 
                                }.bind(this, this.keyCooldown, key), 300);
                            }.bind(this)

                            GameCreator.helpers.runEventActions(keySets, this, conditionPassedCallback);
                        }
                    }
                }
            }
        };

        
    };

    GameCreator.addObjFunctions.stoppableObjectFunctions = function(object) {
        object.stop = function(params) {
            var obj, quadrant;
            if (!params || !params.hasOwnProperty("collisionObject")) {
                this.attributes.speedY = 0;
                this.attributes.speedX = 0;
            } else {
                obj = params.collisionObject;
                if (!obj) {
                    throw GameCreator.errors.StopActionNoCollisionObject;
                }
                quadrant = GameCreator.helpers.determineQuadrant(obj, this);
                if (this.attributes.speedY > 0 && quadrant === 1) {
                    this.attributes.speedY = 0;
                    this.attributes.y = obj.attributes.y - this.attributes.height + 0.1;
                    this.objectsBeneath.push(obj.attributes.instanceId);
                }
                if (this.attributes.speedX < 0 && quadrant === 2) {
                    this.attributes.speedX = 0;
                    this.attributes.x = obj.attributes.x + obj.attributes.width - 0.1;
                    this.objectsLeft.push(obj.attributes.instanceId);
                }
                if (this.attributes.speedY < 0 && quadrant === 3) {
                    this.attributes.speedY = 0;
                    this.attributes.y = obj.attributes.y + obj.attributes.height - 0.1;
                    this.objectsAbove.push(obj.attributes.instanceId);
                }
                if (this.attributes.speedX > 0 && quadrant === 4) {
                    this.attributes.speedX = 0;
                    this.attributes.x = obj.attributes.x - this.attributes.width + 0.1;
                    this.objectsRight.push(obj.attributes.instanceId);
                }
            }
        };
    };

    GameCreator.addObjFunctions.clickableObjectAttributes = function(object) {
        object.onClickSets = [];
        object.isClickable = true;
    };

    GameCreator.commonObjectFunctions.getDefaultState = function() {
        return GameCreator.helpers.getObjectById(this.states, 0);
    };

    GameCreator.commonObjectFunctions.getState = function(stateId) {
      return GameCreator.helpers.getObjectById(this.states, stateId);  
    };


    GameCreator.commonObjectFunctions.isShootable = function() {
        return ['FreeObject', 'PlatformObject', 'TopDownObject'].indexOf(this.objectType) != -1;
    };

    GameCreator.commonObjectFunctions.createState = function(name, attributes) {
        var newStateId = 0;
        while (this.getState(newStateId) != undefined) {
            newStateId++;
        }
        var newStateName = name || "state" + newStateId;
        var newState = {
            name: newStateName,
            id: newStateId,
            attributes: attributes ? attributes : {}
        };
        this.states.push(newState);
        return newState;
    };

    GameCreator.commonObjectFunctions.removeAttributeFromState = function(attributeName, stateId) {
        var state = this.getState(stateId);
        if(!state.attributes[attributeName]) {
            return false;
        }
        delete state.attributes[attributeName];
        return true;
    };

    GameCreator.commonObjectFunctions.resetStateAttributes = function(stateId) {
        var state = this.getState(stateId);
        state.attributes = $.extend({}, this.getDefaultState().attributes);
    };
}());
