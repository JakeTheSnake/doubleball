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

        var state = GameCreator.helperFunctions.getObjectById(globalObj.states, this.currentState);

        this.x = args.x;
        this.y = args.y;

        this.width = args.width !== undefined ? args.width : state.width;
        this.height = args.height !== undefined ? args.height : state.height;
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
        return GameCreator.helperFunctions.getObjectById(this.parent.states, this.currentState);
    }
}());