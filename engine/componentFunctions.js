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
        object.keyPressed = {
            shift: false,
            ctrl: false,
            alt: false,
            space: false,
            leftMouse: false,
            rightMouse: false
        };

        object.onKeySets = {
            shift: [],
            ctrl: [],
            alt: [],
            space: [],
            leftMouse: [],
            rightMouse: [],
        };

        object.selectableKeys = Object.keys(object.keyPressed);
    };

    GameCreator.addObjFunctions.keyObjectFunctions = function(object) {
        object.checkEvents = function() {
            var j, key, isKeyPressed, keySets, actions;
            var globalObj = this.parent;
            //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
            for (key in globalObj.keyPressed) {
                if (globalObj.keyPressed.hasOwnProperty(key)) {
                    isKeyPressed = globalObj.keyPressed[key];
                    keySets = globalObj.onKeySets[key];

                    if (isKeyPressed && !this.keyCooldown[key]) {
                        if (GameCreator.state === 'directing' && keySets.length === 0) {
                            keySets.push(new GameCreator.ConditionActionSet());
                            actions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
                            GameCreator.UI.openEditActionsWindow(
                                GameCreator.htmlStrings.defaultEventInformationWindow("Pressed " + key + " actions for " + globalObj.objectName, this.getCurrentImage().src),
                                 new GameCreator.CASetVM(keySets[0], GameCreator.helpers.getNonCollisionActions(globalObj.objectType), globalObj), globalObj.objectName
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

        object.resetKeys = function() {
            this.keyLeftPressed = false;
            this.keyRightPressed = false;
            this.keyUpPressed = false;
            this.keyDownPressed = false;
            var keys = Object.keys(this.keyPressed);
            keys.forEach(function(key) {
                this.keyPressed[key] = false;
            }.bind(this));
        };

        object.initializeKeyListeners = function() {
            var that = this;
            $(document).on("keydown.gameKeyListener", function(e) {
                switch (e.which) {
                case 16:
                    that.keyPressed.shift = true;
                    break;
                case 17:
                    that.keyPressed.ctrl = true;
                    break;
                case 18:
                    that.keyPressed.alt = true;
                    break;
                case 32:
                    that.keyPressed.space = true;
                    break;
                case 65:
                case 37:
                    that.keyLeftPressed = true;
                    break;
                case 87:
                case 38:
                    that.keyUpPressed = true;
                    break;
                case 68:
                case 39:
                    that.keyRightPressed = true;
                    break;
                case 83:
                case 40:
                    that.keyDownPressed = true;
                    break;
                default:
                    return;
                }
                e.preventDefault();
            });
            $(document).on("keyup.gameKeyListener", function(e) {
                switch (e.which) {
                case 16:
                    that.keyPressed.shift = false;
                    break;
                case 17:
                    that.keyPressed.ctrl = false;
                    break;
                case 18:
                    that.keyPressed.alt = false;
                    break;
                case 32:
                    that.keyPressed.space = false;
                    break;
                case 65:
                case 37:
                    that.keyLeftPressed = false;
                    break;
                case 87:
                case 38:
                    that.keyUpPressed = false;
                    break;
                case 68:
                case 39:
                    that.keyRightPressed = false;
                    break;
                case 83:
                case 40:
                    that.keyDownPressed = false;
                    break;
                default:
                    return;
                }
                e.preventDefault();
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