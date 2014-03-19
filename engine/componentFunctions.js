/*global GameCreator, $, setTimeout*/
(function() {
    "use strict";
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
        object.collisionActions = [];
    };

    GameCreator.addObjFunctions.keyObjectAttributes = function(object) {
        object.keyPressed = {
            space: false,
            leftMouse: false,
            rightMouse: false
        };
        object.keyActions = {};
    };

    GameCreator.addObjFunctions.keyObjectFunctions = function(object) {
        object.checkEvents = function() {
            var i, key, isKeyPressed, keyAction, actions;
            //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
            for (key in this.parent.keyPressed) {
                if (this.parent.keyPressed.hasOwnProperty(key)) {
                    isKeyPressed = this.parent.keyPressed[key];
                    keyAction = this.parent.keyActions[key];
                    if (isKeyPressed && !this.keyCooldown[key]) {
                        if (keyAction === undefined && GameCreator.state !== 'playing') {
                            if (this.parent.objectType === "mouseObject") {
                                actions = GameCreator.actionGroups.mouseNonCollisionActions;
                            } else {
                                actions = GameCreator.actionGroups.nonCollisionActions;
                            }
                            this.parent.keyActions[key] = [];
                            GameCreator.UI.openEditActionsWindow(
                                "Pressed " + key + " actions for " + this.parent.objectName,
                                 actions,
                                 this.parent.keyActions[key],
                                 this.objectName
                                );
                        } else if (keyAction !== undefined) {
                            for (i = 0; i < keyAction.length; i += 1) {
                                keyAction[i].runAction(this);
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
        object.onClickActions = undefined;
        object.isClickable = true;
    };
}());