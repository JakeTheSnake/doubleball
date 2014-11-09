/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.SceneObject = function() {
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.counters = {};
        this.collidingWith = [];

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
        this.route.splice(index + 1, 0, {x: 10, y: 10});
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
        this.displayWidth = parseInt(this.attributes.width[this.attributes.width.length - 1], 10);
        this.displayHeight = parseInt(this.attributes.height[this.attributes.height.length - 1], 10);
        GameCreator.invalidate(this);
    };

    GameCreator.SceneObject.prototype.instantiate = function(globalObj, args) {
        this.invalidated = true;
        this.currentState = args.currentState || 0;
        this.parent = globalObj;
        var state = this.getCurrentState();

        this.attributes.x = args.x;
        this.attributes.y = args.y;

        this.attributes.width = args.width !== undefined ? args.width.slice(0) : state.attributes.width.slice(0);
        this.attributes.height = args.height !== undefined ? args.height.slice(0) : state.attributes.height.slice(0);
        this.attributes.image = args.image !== undefined ? args.image : state.attributes.image;
        
        this.objectName = args.objectName !== undefined ? args.objectName : globalObj.objectName;
        this.attributes.instanceId = this.objectName + GameCreator.getUniqueId();

        globalObj.instantiateSceneObject(this, args);

        this.update();

        this.counters = {};
        GameCreator.resetCounters(this, this.parent.parentCounters);
    };

    GameCreator.SceneObject.prototype.remove = function() {
        var activeScene = GameCreator.getActiveScene();
        activeScene.objects.splice(activeScene.objects.indexOf(this), 1);
        GameCreator.renderableObjects.splice(GameCreator.renderableObjects.indexOf(this), 1);
        if (GameCreator.selectedObject === this) {
            GameCreator.selectedObject = null;
            GameCreator.drawSelectionLine();
            GameCreator.hideRoute();
            GameCreator.setupScenePropertiesForm();
        }
        GameCreator.render();
    };

    GameCreator.SceneObject.prototype.reset = function() {
        GameCreator.resetCounters(this, this.parent.parentCounters);
        this.collidingWith = [];
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
        return GameCreator.helpers.getObjectById(this.parent.states, this.currentState);
    }

    GameCreator.SceneObject.prototype.getDragFunction = function(x, y) {
        var border = 8;
        if (y >= this.attributes.y && 
                y <= this.attributes.y + this.displayHeight &&
                x >= this.attributes.x &&
                x <= this.attributes.x + this.displayWidth) {
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
        }
        return null;
    };

    GameCreator.SceneObject.prototype.setState = function(stateId) {
        var state = this.parent.getState(stateId);
        var attrKeys = Object.keys(state.attributes);
        var i, stateAttribute;
        for (i = 0; i < attrKeys.length; i += 1) {
            stateAttribute = state.attributes[attrKeys[i]];
            this.attributes[attrKeys[i]] = Array.isArray(stateAttribute) ? GameCreator.helpers.getRandomFromRange(stateAttribute) : stateAttribute;
        }
        this.currentState = stateId;
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
        this.displayWidth = this.attributes.width[this.attributes.width.length - 1];
        this.displayHeight = this.attributes.height[this.attributes.height.length - 1];
        GameCreator.UI.updateSceneObjectForm(this);
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

    GameCreator.SceneObject.prototype.moveObject = function(x, y) {
        if (!this.clickOffsetX) {
            this.clickOffsetX = x - this.attributes.x;
            this.clickOffsetY = y - this.attributes.y;
        }
        this.attributes.x = x - this.clickOffsetX;
        this.attributes.y = y - this.clickOffsetY;
    };
}());