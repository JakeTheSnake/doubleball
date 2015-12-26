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
        if (this.actions[i].hasReferenceToGlobalObj(globalObjId)) {
            this.actions.splice(i, 1);
            i -= 1;
        }
    }
    for (var i = 0; i < this.conditions.length; i += 1) {
        if (this.conditions[i].hasReferenceToGlobalObj(globalObjId)) {
            this.conditions.splice(i, 1);
            i -= 1;
        }
    }
}

}());
