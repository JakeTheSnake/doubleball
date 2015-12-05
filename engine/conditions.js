(function() {

GameCreator.Condition = function(args) {
    this.evaluate = args.evaluate;
    this.params = args.params;
}

GameCreator.conditions = {
    objectExists: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            var item = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, Number(params.objId));
            var itemCount = item ? item.runtimeObjects.length : 0;

            if (params.comparator === 'greaterThan') {
                return itemCount > params.count;
            }
            if (params.comparator === 'lessThan') {
                return itemCount < params.count;
            }
            return itemCount === params.count;
        },
    }),

    isInState: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            if(runtimeObj.parent.attributes !== undefined && runtimeObj.parent.attributes.unique) {
                return runtimeObj.parent.currentState === Number(params.state);    
            } else {
                return runtimeObj.currentState === Number(params.state);    
            }
        },
    }),

    counterEquals: new GameCreator.Condition({
        evaluate: function (runtimeObj, params) {
            var counterCarrier;
            if (runtimeObj.parent.attributes.unique) {
                counterCarrier = runtimeObj.parent;
            } else {
                counterCarrier = runtimeObj;
            }

            if (params.comparator === 'greaterThan') {
                return counterCarrier.counters[params.counter].value >= Number(params.value);
            }
            if (params.comparator === 'lessThan') {
                return counterCarrier.counters[params.counter].value <= Number(params.value);
            }
            return counterCarrier.counters[params.counter].value === Number(params.value);
        },
    }),

    currentScene: new GameCreator.Condition({
        evaluate: function (runtimeObj, params) {
            var currentSceneIndex = GameCreator.helpers.getIndexOfSceneWithId(GameCreator.activeSceneId);
            var targetSceneIndex = GameCreator.helpers.getIndexOfSceneWithId(Number(params.scene));

            if (currentSceneIndex !== undefined && targetSceneIndex !== undefined) {
                if (params.comparator === 'greaterThan') {
                    return currentSceneIndex > targetSceneIndex;
                }
                if (params.comparator === 'lessThan') {
                    return currentSceneIndex < targetSceneIndex;
                }
                return currentSceneIndex === targetSceneIndex;
            }

            return false;
        },
    }),

    collidesWith: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            var sceneObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(params.objId));
            for(var i = 0; i < sceneObjects.length; i += 1) {
                if (GameCreator.helpers.checkObjectCollision(runtimeObj, sceneObjects[i])) {
                    return true;
                }
            }
            return false;
        },
    }),

    randomCondition: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            var randomInt = Math.ceil(Math.random() * params.maxRandomValue);
            if (params.comparator === 'greaterThan') {
                return randomInt > params.value;
            }
            if (params.comparator === 'lessThan') {
                return randomInt < params.value;
            }
            return randomInt === params.value;
        },
    }),

    timeElapsed: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            return GameCreator.timerHandler.gameTime >= params.time;
        },
    }),


}

GameCreator.RuntimeCondition = function(name, params) {
    var i;
    this.name = name;
    this.parameters = params || {};
}

GameCreator.RuntimeCondition.prototype.evaluate = function(runtimeObj) {
    return GameCreator.conditions[this.name].evaluate(runtimeObj, this.parameters);
}

GameCreator.RuntimeCondition.prototype.getAllParameters = function() {
    return GameCreator.conditions[this.name].params;
}

GameCreator.RuntimeCondition.prototype.getParameter = function(name) {
    return GameCreator.conditions[this.name].params[name];
}

GameCreator.conditionGroups = {
    globalCounterConditions: {
        objectExists: GameCreator.conditions.objectExists,
        currentScene: GameCreator.conditions.currentScene,
        randomCondition: GameCreator.conditions.randomCondition,
        timeElapsed: GameCreator.conditions.timeElapsed
    },

    objectConditions: GameCreator.conditions
}

})();