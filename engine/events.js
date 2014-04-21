GameCreator.Event = function() {
    this.conditions = [];
    this.actions = [];
    this.actionWindowAlreadyOpened = false;
    this.runtimeObj = null;
}

GameCreator.Event.prototype.checkConditions = function() {
    for (var i = 0; i < this.conditions.length; i++) {
        if (this.conditions[i]() === false) {
            return false;
        }
    }
    return true;
}

GameCreator.Event.prototype.runActions = function(runtimeObj) {
    for (var i = 0; i < this.actions.length; i++) {
        this.actions[i].runAction(runtimeObj);
    }
}

GameCreator.Event.prototype.shouldOpenActionWindow = function() {
    return this.actions.length === 0 && 
        GameCreator.state !== 'playing' && 
        this.actionWindowAlreadyOpened === false;
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