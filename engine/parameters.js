/**
* All Paremeters are currently just dummy objects
*/

GameCreator.GlobalObjectParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.GlobalObjectParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.singleSelector(this.name, GameCreator.globalObjects) + '</td>';
    return result;
}

GameCreator.SceneObjectParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.SceneObjectParameter.prototype.getPresentation = function() {
    var result = "<td>" + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.defaultValue) + "</td>";
    return result;
};

GameCreator.NumberParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.NumberParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.EffectParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.EffectParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.DirectionParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.DirectionParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.CounterParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.CounterParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.CounterChangeTypeParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.CounterChangeTypeParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.StateParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.StateParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};

GameCreator.SwitchSceneParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.SwitchSceneParameter.prototype.getPresentation = function() {
    var result = '<td>' + this.name + ':</td><td>' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</td>";
    return result;
};