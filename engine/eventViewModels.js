// Number
// Random number
// Scene Object
// Counter
// Timing
GameCreator.GlobalObjectParameter = function(name, eventDataItem, mandatory, defaultValue) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = defaultValue;
};

GameCreator.GlobalObjectParameter.prototype.getPresentation = function() {
    var result = '<div ' + (this.value === undefined ? 'style="color: #FF0000;"' : '') +'>' + this.name + ': ' + GameCreator.htmlStrings.singleSelector(this.name, GameCreator.globalObjects) + '</div>';
    return result;
}

GameCreator.SceneObjectParameter = function(name, eventDataItem, mandatory, defaultValue) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = defaultValue;
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
    this.caSet = caSet;

    this.conditionVMs = this.getVMItemList(this.caSet.conditions);
    this.actionVMs = this.getVMItemList(this.caSet.actions);
}

GameCreator.CASetVM.prototype.getVMItemList = function(collection) {
    var i;
    var result = [];
    for (i = 0; i < collection.length; i++) {
        result.push(new GameCreator.CASetItemVM(collection[i]));
    }
    return result;
}

GameCreator.CASetVM.prototype.addCondition = function(conditionName) {
    var params = {}, i;
    var paramNames = Object.keys(GameCreator.conditions[conditionName].params);
    for (i = 0; i < paramNames.length; i+=1) {
        params[paramNames[i]] = GameCreator.conditions[conditionName].params[paramNames[i]].defaultValue;
    }
    var runtimeCondition = new GameCreator.RuntimeCondition(conditionName, params);
    this.caSet.conditions.push(runtimeCondition);
    this.conditionVMs = this.getVMItemList(this.caSet.conditions);
};

GameCreator.CASetVM.prototype.getPresentation = function(active) {
    var conditionsList, listItem = document.createElement('li');
    var i, names, that = this;

    if (active) {
        $(listItem).addClass('active');
        conditionsList = document.createElement('ul');

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

GameCreator.CASetItemVM = function(databaseObject) {
    this.databaseObject = databaseObject; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
    this.redrawSelectedParameters();

    // Todo: Here we need to add an on click listener which selects this
    // eventDataItem in the UI and enables the user to add parameters to it.
};

GameCreator.CASetItemVM.prototype.getPresentation = function() {
    var result = document.createElement('li');
    var title =document.createElement('span');
    $(title).append(this.databaseObject.name);
    $(result).append(title);
    var paramList = document.createElement('ul');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItem = document.createElement('li');
        $(paramItem).append(this.parameters[i].getPresentation())
        $(paramList).append(paramItem);
    }
    $(result).append(paramList);
    return result;
}

/**
 * Returns the list of addable parmeters for this action item.
 *
 * The list will include the parameters not currently used.
 */
GameCreator.CASetItemVM.prototype.getAvailableParameters = function() {
    var result = [];
    var existingParams = Object.keys(this.databaseObject.parameters); 
    var allParams = this.databaseObject.getAllParameters();

    for (var i = 0; i < Object.keys(allParams).length; i++) {
        var param = Object.keys(allParams)[i];
        if (!existingParams.some(function(item) { return item.name == param; })) {
            var currentParam = this.databaseObject.getParameter(param);
            var mandatory = this.databaseObject.getParamMandatory(param);
            var defaultValue = this.databaseObject.getParamDefaultValue(param);
            result.push(
                new currentParam.param(param, this, mandatory, defaultValue)
            );
        }
    }

    return result;
};

GameCreator.CASetItemVM.prototype.getSelectedParameters = function() {
    var caSetItemVM = this;
    var allParams = this.databaseObject.getAllParameters();
    return Object.keys(this.databaseObject.parameters).collect(function(item) {
       var currentParam = caSetItemVM.databaseObject.getParameter(item);
       return new currentParam.param(item, caSetItemVM, currentParam.mandatory, caSetItemVM.databaseObject.parameters[item]);
    });
}

GameCreator.CASetItemVM.prototype.getParameter = function(name) {
    var i;
    for (i = 0; i < this.parameters.length; i++) {
        if (this.parameters[i].name == name) {
            return this.parameters[i];
        }
    }
    return null;
}

GameCreator.CASetItemVM.prototype.appendParameter = function(name) {
    var paramObject = GameCreator.actions[this.runtimeAction.name].params[name];
    var parameter = new paramObject.param(name, this, paramObject.mandatory, paramObject.defaultValue);
    this.parameters.append(parameter);
}

GameCreator.CASetItemVM.prototype.removeParameter = function(name) {
    delete this.runtimeAction.params[name];
    this.redrawSelectedParameters();
}

GameCreator.CASetItemVM.prototype.redrawSelectedParameters = function() {
    var i;
    this.parameters = this.getSelectedParameters();
    for (i = 0; i < this.parameters.length; i++) {
        // TODO: Here we should add the presentation for all parameters
        // to the container under its action in the UI.
        //$(this.actionId).append(this.parameters[i].getPresentation());
    }
}




