GameCreator.ConditionActionSet = function() {
    this.conditions = [];
    this.actions = [];
}

GameCreator.ConditionActionSet.prototype.checkConditions = function(runtimeObj) {
    for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i].evaluate(runtimeObj) === false) {
            return false;
        }
    }
    return true;
}

GameCreator.ConditionActionSet.prototype.runActions = function(runtimeObj, runtimeParameters) {
    for (var i = 0; i < this.actions.length; i++) {
        this.actions[i].runAction(runtimeObj, runtimeParameters);
    }
}

GameCreator.ConditionActionSet.prototype.addCondition = function(condition) {
    this.conditions.push(condition);
}

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
        params: {
            objId: {
                param: GameCreator.GlobalObjectParameter,
                mandatory: true,
            },
            comparator: {
                param: GameCreator.ComparatorParameter,
                mandatory: true,
                defaultValue: 'equals'
            },
            count: {
                param: GameCreator.NumberParameter,
                mandatory: false,
                defaultValue: 1
            }
        }
    }),

    isInState: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            if(runtimeObj.parent.attributes !== undefined && runtimeObj.parent.attributes.unique) {
                return runtimeObj.parent.currentState === Number(params.state);    
            } else {
                return runtimeObj.currentState === Number(params.state);    
            }
        },
        params: {
            state: {
                param: GameCreator.StateParameter,
                mandatory: false,
                defaultValue: 0
            }
        }
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
        params: {
            counter: {
                param: GameCreator.CounterParameter,
                mandatory: true,
            },
            comparator: {
                param: GameCreator.ComparatorParameter,
                mandatory: true,
                defaultValue: 'equals'
            },
            value: {
                param: GameCreator.NumberParameter,
                mandatory: false,
                defaultValue: 0
            }
        }
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
        params: {
            comparator: {
                param: GameCreator.ComparatorParameter,
                mandatory: true,
                defaultValue: 'equals'
            },
            scene: {
                param: GameCreator.SwitchSceneParameter,
                mandatory: true,
            },
        }
    }),

    collidesWith: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            var sceneObjects = GameCreator.helpers.getActiveInstancesOfGlobalObject(Number(params.objId));
            for(i = 0; i < sceneObjects.length; i += 1) {
                if (GameCreator.helpers.checkObjectCollision(runtimeObj, sceneObjects[i])) {
                    return true;
                }
            }
            return false;
        },
        params: {
            objId: {
                param: GameCreator.GlobalObjectParameter,
                mandatory: true
            },
        }
    })


}

GameCreator.RuntimeCondition = function(name, params) {
    this.name = name;
    this.parameters = params;
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

