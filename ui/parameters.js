/**
* All Paremeters are currently just dummy objects
*/
(function() {
"use strict";


var updateParameter = function(sceneObjectId, observer) {
    var globalObj;
    if (sceneObjectId === 'this') {
        globalObj = this.itemVM.globalObj;
    } else {
        globalObj = GameCreator.getSceneObjectById(sceneObjectId).parent;
    }

    var paramValuePresenter = this.getValuePresenter();
    $(this.element).replaceWith(paramValuePresenter);
    this.element = paramValuePresenter;
    var observer = this.itemVM.template.params[this.name].observer;
    var defaultValue = this.itemVM.template.params[this.name].defaultValue;
    this.itemVM.model.parameters[this.name] = defaultValue;

    this.setupValuePresenter(paramValuePresenter, this.itemVM.model.parameters,
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

GameCreator.ComparatorParameter = function (itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.ComparatorParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'comparatorInput');
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

GameCreator.MovementTypeParameter = function (itemVM, paramName, mandatory) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.element = this.getValuePresenter();
};

GameCreator.MovementTypeParameter.prototype.getValuePresenter = function () {
    var element = document.createElement('td');
    element.setAttribute('data-inputtype', 'movementTypeInput');
    return element;
};

GameCreator.DirectionParameter = function(itemVM, paramName, mandatory, runtimeAction) {
    this.name = paramName;
    this.itemVM = itemVM;
    this.mandatory = mandatory;
    this.runtimeAction = runtimeAction;
    this.element = this.getValuePresenter();
};

GameCreator.DirectionParameter.prototype.getValuePresenter = function() {
    var element = document.createElement('td');
    return element;
};

GameCreator.DirectionParameter.prototype.setupValuePresenter = function(container) {
    var parent = container;
    var inputOpen = false;
    var presentation = document.createElement('span');
    var prettyName = GameCreator.helpers.getPrettyName(this.runtimeAction.parameters.projectileDirection);
    var param = this;
    $(presentation).html(prettyName + ' ' + (this.runtimeAction.parameters.projectileDirection === "Towards" ? this.runtimeAction.parameters.target : ''));
    
    var onClickFunc = function() {
        if (!inputOpen) {
            inputOpen = true;
            $(parent).html(GameCreator.htmlStrings.singleSelector(
                GameCreator.directions,
                '', param.runtimeAction.parameters.projectileDirection)
            );
            var directionSelect = $(parent).find('select')[0];
            $(directionSelect).focus();
            var targetSelect = GameCreator.htmlStrings.sceneObjectInput('target', param.runtimeAction.parameters.target);
            $(parent).append(targetSelect);
            var input = $(parent).find('[data-attrname="target"]');
            $(input).hide();
            $(directionSelect).change(function() {
                if ($(this).val() === 'Towards') {
                    $(input).css('display', 'block');
                } else {
                    $(input).hide();
                }
            });

            $(directionSelect).trigger('change');

            $(parent).off('focusout').on('focusout', function() {
                setTimeout(function() {
                    if ($(parent).find(':focus').length === 0) {
                        inputOpen = false;
                        param.runtimeAction.parameters.projectileDirection = $(directionSelect).val();
                        param.runtimeAction.parameters.target = $($(parent).find('[data-attrname="target"]')[0]).val();
                        var presentation = document.createElement('span');
                        prettyName = GameCreator.helpers.getPrettyName(param.runtimeAction.parameters.projectileDirection);
                        $(presentation).html(prettyName + ' ' + (param.runtimeAction.parameters.projectileDirection === "Towards" ? param.runtimeAction.parameters.target : ''));
                        $(presentation).click(onClickFunc);
                        $(parent).html(presentation);
                    }
                }, 0);
            });
        }
    };

    $(parent).click(onClickFunc);

    $(parent).html(presentation);
};

GameCreator.TimingParameter = function(runtimeAction) {
    this.runtimeAction = runtimeAction;
    this.name = 'Timing';
};

GameCreator.TimingParameter.prototype.setupValuePresenter = function(container) {
    var timingTypeSelect, inputOpen = false;
    var parent = document.createElement('td');
    var presentation = document.createElement('span');
    var prettyName = GameCreator.helpers.getPrettyName(this.runtimeAction.timing.type);
    var param = this;

    $(presentation).html(prettyName + ' ' + (param.runtimeAction.timing.type !== 'now' ? this.runtimeAction.timing.time : ''));
    
    var closeInput = function() {
        setTimeout(function() {
            if ($(parent).find(':focus').length === 0) {
                inputOpen = false;
                param.runtimeAction.timing.type = $(timingTypeSelect).val();
                param.runtimeAction.timing.time = Number($($(parent).find('input')[0]).val());
                var presentation = document.createElement('span');
                prettyName = GameCreator.helpers.getPrettyName(param.runtimeAction.timing.type);
                $(presentation).html(prettyName + ' ' + (param.runtimeAction.timing.type !== 'now' ? param.runtimeAction.timing.time : ''));
                $(presentation).click(onClickFunc);
                $(parent).html(presentation);
            }
        }, 0);
    };

    var onClickFunc = function(evt) {
        if (!inputOpen) {
            inputOpen = true;
            $(parent).html(GameCreator.htmlStrings.singleSelector(
                GameCreator.helpers.getSelectableTimings(param.runtimeAction.name),
                '', param.runtimeAction.timing.type)
            );
            timingTypeSelect = $(parent).find('select')[0];
            $(timingTypeSelect).focus();
            var timingValue = GameCreator.htmlStrings.numberInput('', param.runtimeAction.timing.time);
            $(parent).append(timingValue);
            var input = $(parent).find('input');
            $(input).hide();
            $(input).focus(function(){
                this.select();
            })

            $(input).keypress(function(event){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode + '' === '13'){
                    this.blur();
                }
            });

            $(timingTypeSelect).change(function() {
                if ($(this).val() !== 'now') {
                    $(input).show();
                } else {
                    $(input).hide();
                }
            });

            $(timingTypeSelect).trigger('change');

            $(parent).off('focusout').on('focusout', function() {
                closeInput();
            });
        }
    };

    $(parent).off('click').on('click', onClickFunc);

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
GameCreator.ComparatorParameter.prototype.getLabel = labelFunction;
GameCreator.MovementTypeParameter.prototype.getLabel = labelFunction;

//Set objects that do not have their own setupValuePresenter to use the default
GameCreator.GlobalObjectParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.ShootableObjectParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.NumberParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.RangeParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.DestroyEffectParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.SwitchSceneParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.StateParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.CounterParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.CounterChangeTypeParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.SceneObjectParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.ComparatorParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;
GameCreator.MovementTypeParameter.prototype.setupValuePresenter = GameCreator.UI.setupValuePresenter;

})();
