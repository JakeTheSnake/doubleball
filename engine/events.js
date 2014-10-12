GameCreator.ConditionActionSet = function(globalObj) {
    this.conditions = [];
    this.actions = [];
    this.globalObj = globalObj.id;
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
            var item = GameCreator.helpers.
                getObjectById(GameCreator.collidableObjects, params.objId);
            if (item) {
                return params.count === item.runtimeObjects.length;
            }
            return false;
        },
        params: {
            objId: {
                param: GameCreator.GlobalObjectParameter,
                mandatory: true,
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
            if (params.objId === 'this') {
                return runtimeObj.currentState === params.state;
            } else {
                return GameCreator.getRuntimeObject(params.objId).currentState === params.state;
            }
        },
        params: {
            objId: {
                param: GameCreator.SceneObjectParameter,
                mandatory: false,
                defaultValue: 'this',
                observer: 'state'
            },
            state: {
                param: GameCreator.StateParameter,
                mandatory: false,
                defaultValue: 0
            }
        }
    }),

    counterEquals: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            if (params.objId === 'this') {
                return runtimeObj.counters[params.counter].value === params.value;
            } else {
                var sceneObject = GameCreator.getRuntimeObject(params.objId);
                if (sceneObject) {
                    return sceneObject.counters[params.counter].value === params.value;
                }
                return false;
            }
        },
        params: {
            objId: {
                param: GameCreator.SceneObjectParameter,
                mandatory: false,
                defaulValue: 'this',
                observer: 'counter'
            },
            counter: {
                param: GameCreator.CounterParameter,
                mandatory: true,
            },
            value: {
                param: GameCreator.NumberParameter,
                mandatory: false,
                defaultValue: 0
            }
        }
    }),

    collidesWith: new GameCreator.Condition({
        evaluate: function(runtimeObj, params) {
            if (params.objId === 'this') {
                return true;
            } else {
                var sceneObject = GameCreator.getRuntimeObject(params.objId);
                if (sceneObject) {
                    return GameCreator.helpers.checkObjectCollision(runtimeObj, sceneObject);
                }
            }
            return false;
        },
        params: {
            objId: {
                param: GameCreator.SceneObjectParameter,
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

