/**
* All Paremeters are currently just dummy objects
*/
(function() {
"use strict";


var updateParameter = function(sceneObjectId, observer) {
    var globalObj;
    if (sceneObjectId === 'this') {
        globalObj = GameCreator.helpers.findGlobalObjectById(this.itemVM.globalObj);
    } else {
        globalObj = GameCreator.getSceneObjectById(sceneObjectId).parent;
    }

    var paramValuePresenter = this.getValuePresenter();
    $(this.element).replaceWith(paramValuePresenter);
    this.element = paramValuePresenter;
    var observer = this.itemVM.template.params[this.name].observer;
    var defaultValue = this.itemVM.template.params[this.name].defaultValue;
    this.itemVM.model.parameters[this.name] = defaultValue;

    GameCreator.UI.setupValuePresenter(paramValuePresenter, this.itemVM.model.parameters,
        this.name, globalObj,
        this.itemVM.updateParameter.bind(this.itemVM, observer));
}

GameCreator.GlobalObjectParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.GlobalObjectParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'globalObjectInput');
    return element;
};

GameCreator.ShootableObjectParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.ShootableObjectParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'shootableObjectInput');
    return element;
};

GameCreator.NumberParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.NumberParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'numberInput');
    return element;
};

GameCreator.RangeParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.RangeParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'rangeInput');
    return element;
};

GameCreator.DestroyEffectParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.DestroyEffectParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'destroyEffectInput');
    return element;
};

GameCreator.DirectionParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.DirectionParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'directionInput');
    return element;
};

GameCreator.CounterParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.CounterParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'counterInput');
    return element;
};

GameCreator.CounterParameter.prototype.update = updateParameter;

GameCreator.CounterChangeTypeParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.CounterChangeTypeParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'counterTypeInput');
    return element;
};

GameCreator.SceneObjectParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.SceneObjectParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'sceneObjectInput');
    return element;
};

GameCreator.StateParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.StateParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'stateInput');
    return element;
};

GameCreator.StateParameter.prototype.update = updateParameter;

GameCreator.SwitchSceneParameter = function(itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.SwitchSceneParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'sceneInput');
    return element;
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
GameCreator.RangeParameter.prototype.getLabel = labelFunction;
GameCreator.DestroyEffectParameter.prototype.getLabel = labelFunction;
GameCreator.DirectionParameter.prototype.getLabel = labelFunction;
GameCreator.SwitchSceneParameter.prototype.getLabel = labelFunction;
GameCreator.StateParameter.prototype.getLabel = labelFunction;
GameCreator.CounterParameter.prototype.getLabel = labelFunction;
GameCreator.CounterChangeTypeParameter.prototype.getLabel = labelFunction;
GameCreator.TimingParameter.prototype.getLabel = labelFunction;
GameCreator.SceneObjectParameter.prototype.getLabel = labelFunction;

})();
