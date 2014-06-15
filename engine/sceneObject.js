/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.SceneObject = function() {
        this.x = 0;
        this.y = 0;
        this.accX = 0;
        this.accY = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.counters = {};

        this.clickOffsetX = 0;
        this.clickOffsetY = 0;

        this.currentState = 0;

        //Global object this refers to.
        this.parent = undefined;

        //Name of object; by default same as the name of global object from which it was created.
        this.objectName = undefined;

        //Unique ID for this specific scene object.
        this.instanceId = undefined;
    };


    GameCreator.SceneObject.prototype.insertNode = function(index) {
        this.route.splice(index + 1, 0, {x: 10, y: 10});
        GameCreator.drawRoute(this.route);
    };

    GameCreator.SceneObject.prototype.removeNode = function(index) {
        this.route.splice(index, 1);
        GameCreator.drawRoute(this.route);
    };

    GameCreator.SceneObject.prototype.update = function() {
        this.displayWidth = parseInt(this.width[this.width.length - 1], 10);
        this.displayHeight = parseInt(this.height[this.height.length - 1], 10);
        GameCreator.invalidate(this);
    };

    GameCreator.SceneObject.prototype.instantiate = function(globalObj, args) {
        this.invalidated = true;
        this.currentState = args.currentState || 0;

        var state = GameCreator.helpers.getObjectById(globalObj.states, this.currentState);

        this.x = args.x;
        this.y = args.y;

        this.width = args.width !== undefined ? args.width.slice(0) : state.attributes.width.slice(0);
        this.height = args.height !== undefined ? args.height.slice(0) : state.attributes.height.slice(0);
        this.parent = globalObj;
        this.objectName = args.objectName !== undefined ? args.objectName : globalObj.objectName;
        this.instanceId = this.objectName + GameCreator.getUniqueId();

        globalObj.instantiateSceneObject(this, args);

        this.update();

        this.counters = {};
        GameCreator.resetCounters(this, this.parent.parentCounters);
    };

    GameCreator.SceneObject.prototype.remove = function() {
        var activeScene = GameCreator.scenes[GameCreator.activeScene];
        activeScene.splice(activeScene.indexOf(this), 1);
        GameCreator.renderableObjects.splice(GameCreator.renderableObjects.indexOf(this), 1);
        GameCreator.render();
    };

    GameCreator.SceneObject.prototype.reset = function() {
        GameCreator.resetCounters(this, this.parent.parentCounters);
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
        var border = 3;
        if (y >= this.y && 
                y <= this.y + this.displayHeight &&
                x >= this.x &&
                x <= this.x + this.displayWidth) {
            if (Math.abs(this.x - x) <= border) {
                return this.resizeLeft;
            } else if (Math.abs(this.x + this.displayWidth - x) <= border) {
                return this.resizeRight;
            } else if (Math.abs(this.y - y) <= border) {
                return this.resizeTop;
            } else if (Math.abs(this.y + this.displayHeight - y) <= border) {
                return this.resizeBottom;
            } else {
                return this.moveObject;
            }
        }
        return null;
    };

    GameCreator.SceneObject.prototype.resizeObject = function(diffX, diffY) {
        if (this.width.length == 2 && diffX) {
            this.width[0] = diffX * this.width[0]/this.width[1];
        }
        if (this.height.length == 2 && diffY) {
            this.height[0] = diffY * this.height[0]/this.height[1];
        }
        this.width[this.width.length-1] = diffX ? diffX : this.width[this.width.length-1];
        this.height[this.height.length-1] = diffY ? diffY : this.height[this.height.length-1];
        this.displayWidth = this.width[this.width.length - 1];
        this.displayHeight = this.height[this.height.length - 1];
    };

    GameCreator.SceneObject.prototype.cleanupSize = function() {
        if (this.width.length == 2) {
            this.width[0] = Math.abs(Math.round(this.width[0]));
        }
        if (this.height.length == 2) {
            this.height[0] = Math.abs(Math.round(this.height[0]));
        }
        if (this.width[this.width.length-1] < 0) {
            this.width[this.width.length-1] = Math.abs(Math.round(this.width[this.width.length-1]));
            this.x = this.x - this.width[this.width.length-1];
        }
        if (this.height[this.height.length-1] < 0) {
            this.height[this.height.length-1] = Math.abs(Math.round(this.height[this.height.length-1]));
            this.y = this.y - this.height[this.height.length-1];
        }
        this.displayWidth = this.width[this.width.length - 1];
        this.displayHeight = this.height[this.height.length - 1];
    };

    GameCreator.SceneObject.prototype.resizeLeft = function(x, y) {
        var diffX = this.x + this.displayWidth - x;
        this.x = x;
        this.resizeObject(diffX, null);
    };

    GameCreator.SceneObject.prototype.resizeRight = function(x, y) {
        var diffX = x - this.x;
        this.resizeObject(diffX, null);
    };

    GameCreator.SceneObject.prototype.resizeTop = function(x, y) {
        var diffY = this.y + this.displayHeight - y;
        this.y = y;
        this.resizeObject(null, diffY);
    };

    GameCreator.SceneObject.prototype.resizeBottom = function(x, y) {
        var diffY = y - this.y;
        this.resizeObject(null, diffY);
    };

    GameCreator.SceneObject.prototype.moveObject = function(x, y) {
        this.x = x - this.clickOffsetX;
        this.y = y - this.clickOffsetY;
    };
}());