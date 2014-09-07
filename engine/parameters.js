/**
* All Paremeters are currently just dummy objects
*/
(function() {
"use strict";

GameCreator.GlobalObjectParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.GlobalObjectParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'globalObjectInput');
    return result;
};

GameCreator.ShootableObjectParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.ShootableObjectParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'shootableObjectInput');
    return result;
};

GameCreator.NumberParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.NumberParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'numberInput');
    return result;
};

GameCreator.DestroyEffectParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.DestroyEffectParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'destroyEffectInput');
    return result;
};

GameCreator.DirectionParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.DirectionParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'directionInput');
    return result;
};

GameCreator.CounterParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.CounterParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'counterInput');
    return result;
};

GameCreator.CounterChangeTypeParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.CounterChangeTypeParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'counterTypeInput');
    return result;
};

GameCreator.StateParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.StateParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'stateInput');
    return result;
};

GameCreator.SwitchSceneParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.SwitchSceneParameter.prototype.getValuePresenter = function() {
    var result = document.createElement('td');
    result.setAttribute('data-inputtype', 'sceneInput');
    return result;
};

var labelFunction = function() {
    return '<td>' + GameCreator.helpers.getPrettyName(this.name) + ':</td>';
}

GameCreator.GlobalObjectParameter.prototype.getLabel = labelFunction;
GameCreator.ShootableObjectParameter.prototype.getLabel = labelFunction;
GameCreator.NumberParameter.prototype.getLabel = labelFunction;
GameCreator.DestroyEffectParameter.prototype.getLabel = labelFunction;
GameCreator.DirectionParameter.prototype.getLabel = labelFunction;
GameCreator.SwitchSceneParameter.prototype.getLabel = labelFunction;
GameCreator.StateParameter.prototype.getLabel = labelFunction;
GameCreator.CounterParameter.prototype.getLabel = labelFunction;
GameCreator.CounterChangeTypeParameter.prototype.getLabel = labelFunction;

})();
