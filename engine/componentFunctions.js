/*global GameCreator, $, setTimeout*/
(function() {
    "use strict";

    GameCreator.addObjFunctions.commonObjectFunctions = function(object) {
        object.getDefaultState = GameCreator.commonObjectFunctions.getDefaultState;
        object.getState = GameCreator.commonObjectFunctions.getState;
        object.createState = GameCreator.commonObjectFunctions.createState;
        object.removeAttributeFromState = GameCreator.commonObjectFunctions.removeAttributeFromState;
        object.resetStateAttributes = GameCreator.commonObjectFunctions.resetStateAttributes;
    }

    GameCreator.addObjFunctions.bounceableObjectFunctions = function(object) {
        object.bounce = function(params) {
            switch (GameCreator.helpers.determineQuadrant(params.collisionObject, this)) {
            case 1:
                this.speedY = -Math.abs(this.speedY);
                break;
            case 2:
                this.speedX = Math.abs(this.speedX);
                break;
            case 3:
                this.speedY = Math.abs(this.speedY);
                break;
            case 4:
                this.speedX = -Math.abs(this.speedX);
                break;
            }
        };
    };

    GameCreator.addObjFunctions.collidableObjectAttributes = function(object) {
        object.onCollideEvents = [];
    };

    GameCreator.addObjFunctions.keyObjectAttributes = function(object) {
        object.keyPressed = {
            space: false,
            leftMouse: false,
            rightMouse: false
        };
        object.keyEvents = {
            space: [],
            leftMouse: [],
            rightMouse: []
        };
    };

    GameCreator.addObjFunctions.keyObjectFunctions = function(object) {
        object.checkEvents = function() {
            var j, key, isKeyPressed, keySets, actions;
            //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
            for (key in this.parent.keyPressed) {
                if (this.parent.keyPressed.hasOwnProperty(key)) {
                    isKeyPressed = this.parent.keyPressed[key];
                    keySets = this.parent.keyEvents[key];

                    if (isKeyPressed && !this.keyCooldown[key]) {
                        if (GameCreator.state === 'directing' && keySets.length === 0) {
                            keySets.push(new GameCreator.ConditionActionSet());
                            actions = GameCreator.helpers.getNonCollisionActions(this.parent.objectType);
                            GameCreator.UI.openEditActionsWindow(
                                "Pressed " + key + " actions for " + this.parent.objectName,
                                 actions,
                                 keySets[0].actions,
                                 this.objectName
                                );
                            GameCreator.bufferedActions.push({actionArray: keySets[0].actions, runtimeObj: this});    
                        } else {
                            for (j = 0; j < keySets.length; j++) {
                                if (keySets[j].checkConditions()) {
                                    keySets[j].runActions(this);
                                    this.keyCooldown[key] = true;
                                    // This anonymous function should ensure that keyAction in the timeout callback
                                    // has the state that it has when the timeout is declared.
                                    (function(keyCooldown, key) {
                                        setTimeout(function() {keyCooldown[key] = false; }, 300);
                                    }(this.keyCooldown, key));    
                                }
                            }
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
                this.speedY = 0;
                this.speedX = 0;
            } else {
                obj = params.collisionObject;
                quadrant = GameCreator.helpers.determineQuadrant(obj, this);
                if (this.speedY > 0 && quadrant === 1) {
                    this.speedY = 0;
                    this.objectBeneath = true;
                }
                if (this.speedX < 0 && quadrant === 2) {
                    this.speedX = 0;
                }
                if (this.speedY < 0 && quadrant === 3) {
                    this.speedY = 0;
                }
                if (this.speedX > 0 && quadrant === 4) {
                    this.speedX = 0;
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

    GameCreator.commonObjectFunctions.createState = function(name, attributes) {
        var newStateId = this.states.length;
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