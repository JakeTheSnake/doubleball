// Number
// Random number
// Scene Object
// Counter
// Timing
GameCreator.GlobalObjectParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.GlobalObjectParameter.prototype.getPresentation = function() {
    var result = '<div ' + (this.value === undefined ? 'style="color: #FF0000;"' : '') +'>' + this.name + ': ' + GameCreator.htmlStrings.singleSelector(this.name, GameCreator.globalObjects) + '</div>';
    return result;
}

GameCreator.SceneObjectParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.SceneObjectParameter.prototype.getPresentation = function() {
    var result = "<div>" + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.defaultValue) + "</div>";
    return result;
};

GameCreator.NumberParameter = function(name, eventDataItem, mandatory, value) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = value;
};

GameCreator.NumberParameter.prototype.getPresentation = function() {
    var result = '<div ' + (this.value === undefined ? 'style="color: #FF0000;"' : '') +'>' + this.name + ': ' + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.value) + "</div>";
    return result;
};

/**
 * This function updates the database with the current parameter value
 * stored in the "value" field.
 */
GameCreator.NumberParameter.prototype.saveParameterValue = function() {
    this.eventDataItem.databaseObject.parameters[this.name] = this.value;
}

GameCreator.NumberParameter.prototype.attachListener = function() {
    var param = this;
    $("#" + this.name + "-input").blur(function() {
        param.value = GameCreator.helper.getValue(this);
        param.saveParameterValue();
        param.eventDataItem.redrawSelectedParameters();
    });
}

GameCreator.CASetVM = function(caSet) {
    var i;
    this.caSet = caSet;
    this.actionVMs = [];
    this.conditionVMs = [];
    for (i = 0; i < this.caSet.actions.length; i++) {
        this.actionVMs.push(new GameCreator.ActionItemVM(this.caSet.actions[i]));
    }

    for (i = 0; i < this.caSet.actions.length; i++) {
        this.conditionVMs.push(new GameCreator.ConditionItemVM(this.caSet.conditions[i]));
    }
}

GameCreator.CASetVM.prototype.addCondition = function(conditionName) {
    var params = {}, i;
    var paramNames = Object.keys(GameCreator.conditions[conditionName].params);
    for (i = 0; i < paramNames.length; i+=1) {
        params[paramNames[i]] = GameCreator.conditions[conditionName].params[paramNames[i]].defaultValue;
    }
    var runtimeCondition = new GameCreator.RuntimeCondition(conditionName, params);
    this.caSet.conditions.push(runtimeCondition);
    this.conditionVMs.push(new GameCreator.ConditionItemVM(runtimeCondition));
};

GameCreator.CASetVM.prototype.getPresentation = function(active) {
    var conditionsList, listItem = document.createElement('li');
    var title = document.createElement('span');
    
    var i, names, that = this;

    if (active) {
        $(listItem).addClass('active');

        conditionsList = document.createElement('div');
        conditionsList.className = 'conditions-group';

        names = [];
        for (i = 0; i < this.conditionVMs.length; i+=1) {
            names.push(this.conditionVMs[i].databaseObject.name);
        }
        $(title).append(names.join(' & '));
        $(conditionsList).append(title);

        for (i = 0; i < this.conditionVMs.length; i+=1) {
            $(conditionsList).append(this.conditionVMs[i].getPresentation());
        }

        var addConditionButton = document.createElement('li');
        $(addConditionButton).html('+');

        $(addConditionButton).on('click', function() {
            GameCreator.UI.populateSelectConditionList(that.conditionVMs, that);
            });
        $(conditionsList).append(addConditionButton);
        $(listItem).append(conditionsList);
    } else {
        names = [];
        for (i = 0; i < this.conditionVMs.length; i+=1) {
            names.push(this.conditionVMs[i].databaseObject.name);
        }
        $(listItem).append(names.join(' & '));

        $(listItem).on('click', function(){
            var actionsColumn = $("#dialogue-panel-actions");
            actionsColumn.html('');
            
            for (i = 0; i < that.actionVMs.length; i+=1) {
                
                var listItem = document.createElement('li');
                $(listItem).append(that.actionVMs[i].getPresentation());
                actionsColumn.append(listItem);
            }
            $("#dialogue-panel-conditions").trigger('redrawList', that);
        });
    }
    return listItem;
}


GameCreator.ConditionItemVM = function(databaseObject) {
    this.databaseObject = databaseObject; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
};

GameCreator.ConditionItemVM.prototype.getPresentation = function() {
    var result = document.createElement('div');
        result.className = 'condition-parameters';
    var title = document.createElement('span');
    
    $(title).append(this.databaseObject.name);
    $(result).append(title);

    var paramList = document.createElement('table');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItemRow = document.createElement('tr');
        var paramItemCell = document.createElement('td');
        $(paramItemCell).append(this.parameters[i].getPresentation())
        $(paramItemRow).append(paramItemCell);
        $(paramList).append(paramItemRow);
    }
    $(result).append(paramList);

    return result;
}

GameCreator.ConditionItemVM.prototype.getSelectedParameters = function() {
    var caSetItemVM = this;
    return Object.keys(this.databaseObject.parameters).collect(function(item) {
       var currentParam = caSetItemVM.databaseObject.getParameter(item);
       return new currentParam.param(item, caSetItemVM, currentParam.mandatory, caSetItemVM.databaseObject.parameters[item]);
    });
}

GameCreator.ActionItemVM = function(databaseObject) {
    this.databaseObject = databaseObject; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
};

GameCreator.ActionItemVM.prototype.getPresentation = function() {
    var result = document.createElement('li');
    var title = document.createElement('span');
    var actionItemVM = this;
    
    // Action title
    $(title).append(this.databaseObject.name);
    $(title).on('click', function() {
        var availableParameters = actionItemVM.getAvailableParameters();
        var i;
        $("#dialogue-panel-add-list").html('');
        for (i = 0; i < availableParameters.length; i++) {
            $("#dialogue-panel-add-list").append(availableParameters[i]);
        }
    });
    $(result).append(title);

    // Action parameter list
    var paramList = document.createElement('ul');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItem = document.createElement('li');
        $(paramItem).append(this.parameters[i].getPresentation())
        $(paramList).append(paramItem);
    }
    $(result).append(paramList);
    this.uiItem = result;
    return result;
}

/**
 * Returns the list of addable parmeters for this action item.
 *
 * The list will include the parameters not currently used.
 */
GameCreator.ActionItemVM.prototype.getAvailableParameters = function() {
    var parameterList = [];

    var existingParams = Object.keys(this.databaseObject.parameters); 
    var allParams = this.databaseObject.getAllParameters();
    var actionItemVM = this;

    for (var i = 0; i < Object.keys(allParams).length; i++) {
        var param = Object.keys(allParams)[i];
        if (existingParams.indexOf(param) === -1) {
            var parameterItem = document.createElement('li');
            $(parameterItem).append(param);
            $(parameterItem).data('actionName', param);

            // Clicking on the parameter name
            $(parameterItem).on('click', function() {
                actionItemVM.appendParameter($(this).data('actionName'));
                $(this).remove();
            });
            parameterList.push(parameterItem);
        }
    }

    return parameterList;
};

GameCreator.ActionItemVM.prototype.getSelectedParameters = function() {
    var caSetItemVM = this;
    return Object.keys(this.databaseObject.parameters).collect(function(item) {
       var currentParam = caSetItemVM.databaseObject.getParameter(item);
       return new currentParam.param(item, caSetItemVM, currentParam.mandatory, caSetItemVM.databaseObject.parameters[item]);
    });
}

GameCreator.ActionItemVM.prototype.getParameter = function(name) {
    var i;
    for (i = 0; i < this.parameters.length; i++) {
        if (this.parameters[i].name == name) {
            return this.parameters[i];
        }
    }
    return null;
}

GameCreator.ActionItemVM.prototype.appendParameter = function(name) {
    var paramObject = GameCreator.actions[this.databaseObject.name].params[name];
    var parameter = new paramObject.param(name, this, paramObject.mandatory, paramObject.defaultValue);
    this.databaseObject.parameters[name] = paramObject.defaultValue;
    this.parameters.push(parameter);
    $(this.uiItem).replaceWith(this.getPresentation());
}

GameCreator.ActionItemVM.prototype.removeParameter = function(name) {
    delete this.databaseObject.params[name];
    this.redrawSelectedParameters();
}



