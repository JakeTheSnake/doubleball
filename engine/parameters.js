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

GameCreator.SceneObjectParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.SceneObjectParameter.prototype.getValuePresenter = function() {
    var result = "<td>" + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.defaultValue) + "</td>";
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

GameCreator.EffectParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.EffectParameter.prototype.getValuePresenter = function() {
    var result = '<td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
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
    var result = '<td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.CounterChangeTypeParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.CounterChangeTypeParameter.prototype.getValuePresenter = function() {
    var result = '<td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.StateParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.StateParameter.prototype.getValuePresenter = function() {
    var result = '<td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.SwitchSceneParameter = function(paramCollection, paramName, mandatory) {
    this.name = paramName;
    this.paramCollection = paramCollection;
    this.mandatory = mandatory;
};

GameCreator.SwitchSceneParameter.prototype.getValuePresenter = function() {
    var result = '<td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

var labelFunction = function() {
    return '<td>' + GameCreator.helpers.getPrettyName(this.name) + ':</td>';
}

GameCreator.GlobalObjectParameter.prototype.getLabel = labelFunction;
GameCreator.ShootableObjectParameter.prototype.getLabel = labelFunction;
GameCreator.SceneObjectParameter.prototype.getLabel = labelFunction;
GameCreator.NumberParameter.prototype.getLabel = labelFunction;
GameCreator.EffectParameter.prototype.getLabel = labelFunction;
GameCreator.DirectionParameter.prototype.getLabel = labelFunction;
GameCreator.SwitchSceneParameter.prototype.getLabel = labelFunction;
GameCreator.StateParameter.prototype.getLabel = labelFunction;
GameCreator.CounterParameter.prototype.getLabel = labelFunction;
GameCreator.CounterChangeTypeParameter.prototype.getLabel = labelFunction;

})();
