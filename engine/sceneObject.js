/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.SceneObject = function() {
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.counters = {};
        this.collidingWith = [];

        this.objectsBeneath = [];
        this.objectsAbove = [];
        this.objectsLeft = [];
        this.objectsRight = [];

        this.attributes = {
            x: 0,
            y: 0,
            accX: 0,
            accY: 0,
            speedX: 0,
            speedY: 0,
            width: 0,
            height: 0,
            instanceId: undefined,
        };

        this.clickOffsetX = 0;
        this.clickOffsetY = 0;

        this.currentState = 0;

        //Global object this refers to.
        this.parent = undefined;

        //Name of object; by default same as the name of global object from which it was created.
        this.objectName = undefined;
    };


    GameCreator.SceneObject.prototype.insertNode = function(index) {
        var prevNode = this.route[index]
        this.route.splice(index + 1, 0, {x: prevNode.x + 10, y: prevNode.y + 10});
        GameCreator.drawRoute(this.route);
    };

    GameCreator.SceneObject.prototype.removeNode = function(index) {
        this.route.splice(index, 1);
        GameCreator.drawRoute(this.route);
    };

    GameCreator.SceneObject.prototype.toggleBounceNode = function(index) {
        this.route[index].bounceNode = !this.route[index].bounceNode;
        GameCreator.drawRoute(this.route);
    };

    GameCreator.SceneObject.prototype.update = function() {
        if (this.parent.onSceneObjectUpdated) {
            this.parent.onSceneObjectUpdated(this);
        }

        this.setDisplayValues();

        //If this is an instance of a unique object, the global object and all instances should be mirrored from this.
        if (this.parent.attributes && this.parent.attributes.unique) {
            GameCreator.helpers.mirrorAttributesToParent(this, this.parent);
            GameCreator.helpers.mirrorAttributesToInstances(this.parent);
        }

        GameCreator.invalidate(this);
    };

    GameCreator.SceneObject.prototype.setDisplayValues = function() {
        this.displayWidth = parseInt(this.attributes.width[this.attributes.width.length - 1], 10);
        this.displayHeight = parseInt(this.attributes.height[this.attributes.height.length - 1], 10);
    }

    GameCreator.SceneObject.prototype.instantiate = function(globalObj, args) {
        this.invalidated = true;
        this.parent = globalObj;
        if (this.parent.attributes !== undefined && this.parent.attributes.unique) {
            this.parent.currentState = args.currentState || 0;
        } else {
            this.currentState = args.currentState || 0;
        }
        var state = this.getCurrentState();

        this.attributes.x = args.x;
        this.attributes.y = args.y;
        this.attributes.isControllingCamera = false;

        this.attributes.width = args.width !== undefined ? args.width.slice(0) : state.attributes.width.slice(0);
        this.attributes.height = args.height !== undefined ? args.height.slice(0) : state.attributes.height.slice(0);
        
        this.objectName = args.objectName !== undefined ? args.objectName : globalObj.objectName;
        this.attributes.instanceId = args.instanceId ? args.instanceId : GameCreator.getUniqueInstanceId(globalObj);

        globalObj.instantiateSceneObject(this, args);

        this.update();

        this.counters = {};
        GameCreator.resetCounters(this, this.parent.parentCounters);
    };

    GameCreator.SceneObject.prototype.alreadyCollidesWith = function(objectName) {
        return this.collidingWith.indexOf(objectName) !== -1;
    }

    GameCreator.SceneObject.prototype.removeFromCollidingList = function(objectName) {
        var objectIndex = this.collidingWith.indexOf(objectName);
        if (objectIndex !== -1) {
            var removedObject = this.collidingWith.splice(objectIndex, 1)[0];
            GameCreator.helpers.updateObjectCollisionArrays(this, removedObject);
        }
    }  

    GameCreator.SceneObject.prototype.remove = function(scene) {
        var activeScene = scene || GameCreator.getActiveScene();
        activeScene.objects.splice(activeScene.objects.indexOf(this), 1);
        GameCreator.renderableObjects.splice(GameCreator.renderableObjects.indexOf(this), 1);
        if (GameCreator.selectedObject === this) {
            GameCreator.selectedObject = null;
            GameCreator.drawObjectSelectedUI();
            GameCreator.hideRoute();
            GameCreator.setupScenePropertiesForm();
        }
        GameCreator.render();
        $(document).trigger('GameCreator.removedSceneObject');
    };

    GameCreator.SceneObject.prototype.reset = function() {
        GameCreator.resetCounters(this, this.parent.parentCounters);
        this.collidingWith = [];
        this.objectsBeneath = [];
        this.objectsAbove = [];
        this.objectsLeft = [];
        this.objectsRight = [];
    };

    GameCreator.SceneObject.prototype.setCounterParent = function() {
        var counter;
        for (counter in this.counters) {
            if (this.counters.hasOwnProperty(counter)) {
                this.counters[counter].parentObject = this;
            }
        }
    };

    GameCreator.SceneObject.prototype.getCurrentState = function() {
        if (this.parent.attributes !== undefined && this.parent.attributes.unique) {
            return GameCreator.helpers.getObjectById(this.parent.states, this.parent.currentState);
        }
        return GameCreator.helpers.getObjectById(this.parent.states, this.currentState);
    };

    GameCreator.SceneObject.prototype.getCurrentImage = function() {
        var image = this.getCurrentState().attributes.image;
        if (image === undefined) {
            image = this.parent.getDefaultState().attributes.image;
        }
        return image;
    };

    GameCreator.SceneObject.prototype.getDragFunction = function(x, y) {
        var border = 8;
        var resizeable = this.parent.isResizeable;
        if (y >= this.attributes.y && 
                y <= this.attributes.y + this.displayHeight &&
                x >= this.attributes.x &&
                x <= this.attributes.x + this.displayWidth) {
            if (this.parent.isResizeable) {
                if (Math.abs(this.attributes.x - x) <= border && Math.abs(this.attributes.y - y) <= border) {
                    return this.resizeNW;
                } else if (Math.abs(this.attributes.x + this.displayWidth - x) <= border && Math.abs(this.attributes.y - y) <= border) {
                    return this.resizeNE;
                } else if (Math.abs(this.attributes.x - x) <= border && Math.abs(this.attributes.y + this.displayHeight - y) <= border) {
                    return this.resizeSW;
                } else if (Math.abs(this.attributes.y + this.displayHeight - y) <= border && Math.abs(this.attributes.x + this.displayWidth - x) <= border) {
                    return this.resizeSE;
                } else if (Math.abs(this.attributes.x - x) <= border) {
                    return this.resizeW;
                } else if (Math.abs(this.attributes.x + this.displayWidth - x) <= border) {
                    return this.resizeE;
                } else if (Math.abs(this.attributes.y - y) <= border) {
                    return this.resizeN;
                } else if (Math.abs(this.attributes.y + this.displayHeight - y) <= border) {
                    return this.resizeS;
                } else {
                    return this.moveObject;
                }
            } else {
                return this.moveObject;
            }
        } else {
            if (Math.abs(this.attributes.minX - x) <= border && Math.abs(this.attributes.minY - y) <= border) {
                return this.resizeMouseAreaNW;
            } else if (Math.abs(this.attributes.maxX - x) <= border && Math.abs(this.attributes.minY - y) <= border) {
                return this.resizeMouseAreaNE;
            } else if (Math.abs(this.attributes.minX - x) <= border && Math.abs(this.attributes.maxY - y) <= border) {
                return this.resizeMouseAreaSW;
            } else if (Math.abs(this.attributes.maxY - y) <= border && Math.abs(this.attributes.maxX - x) <= border) {
                return this.resizeMouseAreaSE;
            } else if (Math.abs(this.attributes.minX - x) <= border) {
                return this.resizeMouseAreaW;
            } else if (Math.abs(this.attributes.maxX - x) <= border) {
                return this.resizeMouseAreaE;
            } else if (Math.abs(this.attributes.minY - y) <= border) {
                return this.resizeMouseAreaN;
            } else if (Math.abs(this.attributes.maxY - y) <= border) {
                return this.resizeMouseAreaS;
            }
        }
        return null;
    };

    GameCreator.SceneObject.prototype.setState = function(stateId) {
        var state = this.parent.getState(stateId);
        if (state !== undefined) {
            var attrKeys = Object.keys(state.attributes);   
            var i, stateAttribute;
            for (i = 0; i < attrKeys.length; i += 1) {
                stateAttribute = state.attributes[attrKeys[i]];
                this.attributes[attrKeys[i]] = Array.isArray(stateAttribute) ? GameCreator.helpers.getRandomFromRange(stateAttribute) : stateAttribute;
            }
            if(this.parent.attributes !== undefined && this.parent.attributes.unique) {
                this.parent.currentState = stateId;    
            } else {
                this.currentState = stateId;    
            }
        }
    }

    GameCreator.SceneObject.prototype.resizeObject = function(diffX, diffY) {
        if (this.attributes.width.length == 2 && diffX) {
            this.attributes.width[0] = diffX * this.attributes.width[0]/this.attributes.width[1];
        }
        if (this.attributes.height.length == 2 && diffY) {
            this.attributes.height[0] = diffY * this.attributes.height[0]/this.attributes.height[1];
        }
        this.attributes.width[this.attributes.width.length-1] = diffX ? diffX : this.attributes.width[this.attributes.width.length-1];
        this.attributes.height[this.attributes.height.length-1] = diffY ? diffY : this.attributes.height[this.attributes.height.length-1];
        this.update();
    };

    GameCreator.SceneObject.prototype.cleanupSize = function() {
        if (this.attributes.width.length == 2) {
            this.attributes.width[0] = Math.abs(Math.round(this.attributes.width[0]));
        }
        if (this.attributes.height.length == 2) {
            this.attributes.height[0] = Math.abs(Math.round(this.attributes.height[0]));
        }
        if (this.attributes.width[this.attributes.width.length-1] < 0) {
            this.attributes.width[this.attributes.width.length-1] = Math.abs(Math.round(this.attributes.width[this.attributes.width.length-1]));
            this.attributes.x = this.attributes.x - this.attributes.width[this.attributes.width.length-1];
        }
        if (this.attributes.height[this.attributes.height.length-1] < 0) {
            this.attributes.height[this.attributes.height.length-1] = Math.abs(Math.round(this.attributes.height[this.attributes.height.length-1]));
            this.attributes.y = this.attributes.y - this.attributes.height[this.attributes.height.length-1];
        }
        this.displayWidth = this.attributes.width[this.attributes.width.length - 1];
        this.displayHeight = this.attributes.height[this.attributes.height.length - 1];
        this.clickOffsetX = null;
        this.clickOffsetY = null;
    };

    GameCreator.SceneObject.prototype.resizeNW = function(x, y) {
        var diffX = this.attributes.x + this.displayWidth - x;
        var diffY = this.attributes.y + this.displayHeight - y;
        this.attributes.x = x;
        this.attributes.y = y;
        this.resizeObject(diffX, diffY);
    };

    GameCreator.SceneObject.prototype.resizeNE = function(x, y) {
        var diffX = x - this.attributes.x;
        var diffY = this.attributes.y + this.displayHeight - y;
        this.attributes.y = y;
        this.resizeObject(diffX, diffY);
    };

    GameCreator.SceneObject.prototype.resizeSE = function(x, y) {
        var diffY = y - this.attributes.y;
        var diffX = x - this.attributes.x;

        this.resizeObject(diffX, diffY);
    };

    GameCreator.SceneObject.prototype.resizeSW = function(x, y) {
        var diffX = this.attributes.x + this.displayWidth - x;
        var diffY = y - this.attributes.y;
        this.attributes.x = x;
        this.resizeObject(diffX, diffY);
    };

    GameCreator.SceneObject.prototype.resizeW = function(x, y) {
        var diffX = this.attributes.x + this.displayWidth - x;
        this.attributes.x = x;
        this.resizeObject(diffX, null);
    };

    GameCreator.SceneObject.prototype.resizeE = function(x, y) {
        var diffX = x - this.attributes.x;
        this.resizeObject(diffX, null);
    };

    GameCreator.SceneObject.prototype.resizeN = function(x, y) {
        var diffY = this.attributes.y + this.displayHeight - y;
        this.attributes.y = y;
        this.resizeObject(null, diffY);
    };

    GameCreator.SceneObject.prototype.resizeS = function(x, y) {
        var diffY = y - this.attributes.y;
        this.resizeObject(null, diffY);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaNW = function(x, y) {
        if (x > this.attributes.maxX) x = this.attributes.maxX;
        if (y > this.attributes.maxY) y = this.attributes.maxY;
        this.attributes.minX = x;
        this.attributes.minY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaNE = function(x, y) {
        if (x < this.attributes.minX) x = this.attributes.minX;
        if (y > this.attributes.maxY) y = this.attributes.maxY;
        this.attributes.maxX = x;
        this.attributes.minY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaSE = function(x, y) {
        if (x < this.attributes.minX) x = this.attributes.minX;
        if (y < this.attributes.minY) y = this.attributes.minY;
        this.attributes.maxX = x;
        this.attributes.maxY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaSW = function(x, y) {
        if (x > this.attributes.maxX) x = this.attributes.maxX;
        if (y < this.attributes.minY) y = this.attributes.minY;
        this.attributes.minX = x;
        this.attributes.maxY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaW = function(x, y) {
        if (x > this.attributes.maxX) x = this.attributes.maxX;
        this.attributes.minX = x;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaE = function(x, y) {
        if (x < this.attributes.minX) x = this.attributes.minX;
        this.attributes.maxX = x;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaN = function(x, y) {
        if (y > this.attributes.maxY) y = this.attributes.maxY;
        this.attributes.minY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.resizeMouseAreaS = function(x, y) {
        if (y < this.attributes.minY) y = this.attributes.minY;
        this.attributes.maxY = y;
        GameCreator.UI.updateSceneObjectForm(this);
    };

    GameCreator.SceneObject.prototype.moveObject = function(x, y) {
        if (!this.clickOffsetX) {
            this.clickOffsetX = x - this.attributes.x;
            this.clickOffsetY = y - this.attributes.y;
        }
        this.attributes.x = x - this.clickOffsetX;
        this.attributes.y = y - this.clickOffsetY;
    };
}());