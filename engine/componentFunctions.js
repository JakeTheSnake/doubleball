/*global GameCreator, $, setTimeout*/
(function() {
    "use strict";

    GameCreator.addObjFunctions.commonObjectFunctions = function(object) {
        object.getDefaultState = GameCreator.commonObjectFunctions.getDefaultState;
        object.getState = GameCreator.commonObjectFunctions.getState;
    }

    GameCreator.addObjFunctions.bounceableObjectFunctions = function(object) {
        object.bounce = function(params) {
            switch (GameCreator.helperFunctions.determineQuadrant(params.collisionObject, this)) {
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
            var j, key, isKeyPressed, keyEvents, actions;
            //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
            for (key in this.parent.keyPressed) {
                if (this.parent.keyPressed.hasOwnProperty(key)) {
                    isKeyPressed = this.parent.keyPressed[key];
                    keyEvents = this.parent.keyEvents[key];

                    if (isKeyPressed && !this.keyCooldown[key]) {
                        if (keyEvents.length === 0) {
                            keyEvents.push(new GameCreator.Event());
                            actions = GameCreator.helperFunctions.getNonCollisionActions(this.parent.objectType);
                            GameCreator.UI.openEditActionsWindow(
                                "Pressed " + key + " actions for " + this.parent.objectName,
                                 actions,
                                 keyEvents[0].actions,
                                 this.objectName
                                );
                            GameCreator.bufferedActions.push({actionArray: keyEvents[0].actions, runtimeObj: this});    
                        } else {
                            for (j = 0; j < keyEvents.length; j++) {
                                if (keyEvents[j].checkConditions()) {
                                    keyEvents[j].runActions(this);
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
                quadrant = GameCreator.helperFunctions.determineQuadrant(obj, this);
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
        object.onClickEvents = [];
        object.isClickable = true;
    };

    GameCreator.commonObjectFunctions.getDefaultState = function() {
        return GameCreator.helperFunctions.getObjectById(this.states, 0);
    };

    GameCreator.commonObjectFunctions.getState = function(stateId) {
      return GameCreator.helperFunctions.getObjectById(this.states, stateId);  
    }
}());