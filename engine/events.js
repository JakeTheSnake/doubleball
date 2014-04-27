GameCreator.Event = function() {
    this.conditions = [];
    this.actions = [];
}

GameCreator.Event.prototype.checkConditions = function() {
    for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i]() === false) {
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

GameCreator.Event.prototype.addCondition = function(condition, parameters) {
    this.conditions.push(function() {
        return GameCreator.eventConditions[condition](parameters);
    });
}

GameCreator.eventConditions = {
    exists: function(parameters) {
        var item = GameCreator.helperFunctions.
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