GameCreator.Event = function() {
    this.conditions = [];
    this.actions = [];
}

GameCreator.Event.prototype.checkConditions = function() {
    for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i].evaluate() === false) {
            return false;
        }
    }
    return true;
}

GameCreator.Event.prototype.runActions = function(runtimeObj, parameters) {
    for (var i = 0; i < this.actions.length; i++) {
        if (parameters) {
            $.extend(this.actions[i].parameters, parameters);
        }
        this.actions[i].runAction(runtimeObj);
    }
}

GameCreator.Event.prototype.addCondition = function(condition) {
    this.conditions.push(condition);
}

GameCreator.eventConditions = {
    exists: function(parameters) {
        var item = GameCreator.helpers.
                getObjectById(GameCreator.collidableObjects, parameters.objId);
        if (item) {
            return parameters.count === item.runtimeObjects.length;
        }
        return false;
    },

    counterValue: function(parameters) {

    },

    objectWithinArea: function(parameters) {

    },

    objectOutsideDisplay: function(parameters) {

    },
}

GameCreator.Condition = function(args) {
    this.evaluate = args.evaluate;
    this.parameters = args.parameters;
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
            objId: GameCreator.GlobalObjectParameter,
            count: GameCreator.NumberParameter
        }
    })
}

GameCreator.RuntimeCondition = function(name, params, value) {
    this.name = name;
    this.parameters = params;
    this.mandatory = true;
    this.value = value;
}

GameCreator.RuntimeCondition.prototype.evaluate = function() {
    return GameCreator.eventConditions[this.name](this.parameters);
}

GameCreator.RuntimeCondition.prototype.getAllParameters = function() {
    return GameCreator.conditions[this.name].params;
}

GameCreator.RuntimeCondition.prototype.getParameter = function(name) {
    return GameCreator.conditions[this.name].params[name];
}

