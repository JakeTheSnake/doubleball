/*global GameCreator, $*/
(function() {
"use strict";

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

GameCreator.ConditionActionSet.prototype.removeReferencesToGlobalObject = function(globalObjId) {
    for (var i = 0; i < this.actions.length; i += 1) {
        if (Number(this.actions[i].parameters.objId) === globalObjId) {
            this.actions.splice(i, 1);
            i -= 1;
        } else if (Number(this.actions[i].parameters.objectId) === globalObjId) {
            this.actions.splice(i, 1);
            i -= 1;
        } else if (Number(this.actions[i].parameters.objectToCreate) === globalObjId) {
            this.actions.splice(i, 1);
            i -= 1;
        } else if (Number(this.actions[i].parameters.objectToShoot) === globalObjId) {
            this.actions.splice(i, 1);
            i -= 1;
        }
    }
    for (var i = 0; i < this.conditions.length; i += 1) {
        if (Number(this.conditions[i].parameters.objId) === globalObjId) {
            this.conditions.splice(i, 1);
            i -= 1;
        }
    }
}

}());
