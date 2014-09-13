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

GameCreator.TimingParameter = function(runtimeAction) {
    this.runtimeAction = runtimeAction;
    this.name = 'Timing';
};

GameCreator.TimingParameter.prototype.setupValuePresenter = function(container) {

    var parent = document.createElement('td');
    var presentation = document.createElement('span');
    var prettyName = GameCreator.helpers.getPrettyName(this.runtimeAction.timing.type);
    var param = this;

    $(presentation).html(prettyName + ' ' + (this.runtimeAction.timing.time || ''));
    
    var onClickFunc = function() {
        $(parent).html(GameCreator.htmlStrings.singleSelector(
            GameCreator.helpers.getSelectableTimings(param.runtimeAction.name),
            '', param.runtimeAction.timing.type)
        );
        var timingTypeSelect = $(parent).find('select')[0];
        $(timingTypeSelect).focus();
        var timingValue = GameCreator.htmlStrings.numberInput('', param.runtimeAction.timing.time);
        $(parent).append(timingValue);
        var input = $(parent).find('input');
        $(input).hide();
        $(timingTypeSelect).change(function() {
            if ($(this).val() !== 'now') {
                $(input).show();
            } else {
                $(input).hide();
            }
        });

        $(timingTypeSelect).trigger('change');

        $(parent).off('focusout').on('focusout', function() {
            setTimeout(function() {
                if ($(parent).find(':focus').length === 0) {
                    param.runtimeAction.timing.type = $(timingTypeSelect).val();
                    param.runtimeAction.timing.time = Number($($(parent).find('input')[0]).val());
                    var presentation = document.createElement('span');
                    prettyName = GameCreator.helpers.getPrettyName(param.runtimeAction.timing.type);
                    $(presentation).html(prettyName + ' ' + (param.runtimeAction.timing.time || ''));
                    $(presentation).click(onClickFunc);
                    $(parent).html(presentation);
                }
            }, 0);
        });
    };

    $(presentation).click(onClickFunc);

    $(parent).html(presentation);

    container.html(this.getLabel());
    container.append(parent);
};

var labelFunction = function() {
    return '<td>' + GameCreator.helpers.getPrettyName(this.name) + ':</td>';
};

GameCreator.GlobalObjectParameter.prototype.getLabel = labelFunction;
GameCreator.ShootableObjectParameter.prototype.getLabel = labelFunction;
GameCreator.NumberParameter.prototype.getLabel = labelFunction;
GameCreator.DestroyEffectParameter.prototype.getLabel = labelFunction;
GameCreator.DirectionParameter.prototype.getLabel = labelFunction;
GameCreator.SwitchSceneParameter.prototype.getLabel = labelFunction;
GameCreator.StateParameter.prototype.getLabel = labelFunction;
GameCreator.CounterParameter.prototype.getLabel = labelFunction;
GameCreator.CounterChangeTypeParameter.prototype.getLabel = labelFunction;
GameCreator.TimingParameter.prototype.getLabel = labelFunction;

})();
