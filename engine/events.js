GameCreator.ConditionActionSet = function(globalObj) {
    this.conditions = [];
    this.actions = [];
    this.globalObj = globalObj;
}

GameCreator.ConditionActionSet.prototype.checkConditions = function() {
    for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i].evaluate() === false) {
            return false;
        }
    }
    return true;
}

GameCreator.ConditionActionSet.prototype.runActions = function(runtimeObj, parameters) {
    for (var i = 0; i < this.actions.length; i++) {
        if (parameters) {
            $.extend(this.actions[i].parameters, parameters);
        }
        this.actions[i].runAction(runtimeObj);
    }
}

GameCreator.ConditionActionSet.prototype.addCondition = function(condition) {
    this.conditions.push(condition);
}

GameCreator.Condition = function(args) {
    this.evaluate = args.evaluate;
    this.params = args.params;
}

GameCreator.conditions =
{
    exists: new GameCreator.Condition({
        evaluate: function(params) {
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
    })
}

GameCreator.RuntimeCondition = function(name, params) {
    this.name = name;
    this.parameters = params;
    this.mandatory = true;
}

GameCreator.RuntimeCondition.prototype.evaluate = function() {
    return GameCreator.conditions[this.name].evaluate(this.parameters);
}

GameCreator.RuntimeCondition.prototype.getAllParameters = function() {
    return GameCreator.conditions[this.name].params;
}

GameCreator.RuntimeCondition.prototype.getParameter = function(name) {
    return GameCreator.conditions[this.name].params[name];
}

