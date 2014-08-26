GameCreator.CASetVM = function(caSet, selectableActions) {
    var i;
    this.caSet = caSet;
    this.actionVMs = [];
    this.conditionVMs = [];
    this.selectableActions = selectableActions;
    for (i = 0; i < this.caSet.actions.length; i++) {
        this.actionVMs.push(new GameCreator.ActionItemVM(this.caSet.actions[i]));
    }

    for (i = 0; i < this.caSet.conditions.length; i++) {
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

GameCreator.CASetVM.prototype.addAction = function(actionName) {
    var j, runtimeAction, parameterName, parameters = {};
    for(j = 0; j < Object.keys(GameCreator.actions[actionName].params).length; j += 1) {
        parameterName = Object.keys(GameCreator.actions[actionName].params)[j];
        parameters[parameterName] = GameCreator.actions[actionName].params[parameterName].defaultValue;
    }
    runtimeAction = new GameCreator.RuntimeAction(actionName, parameters);
    this.caSet.actions.push(runtimeAction);
    this.actionVMs.push(new GameCreator.ActionItemVM(runtimeAction));
}

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
            GameCreator.UI.populateSelectConditionList(that);
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
            $("#dialogue-panel-actions").trigger('redrawList', that);
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
        $(paramItemRow).append(this.parameters[i].getPresentation());
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
    this.parameters = this.getParameters();
};

GameCreator.ActionItemVM.prototype.getPresentation = function() {
    var result = document.createElement('li');
    var title = document.createElement('span');
    var actionItemVM = this;
    
    // Action title
    $(title).append(this.databaseObject.name);

    $(result).append(title);

    // Action parameter list
    var paramList = document.createElement('table');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItem = document.createElement('tr');
        $(paramItem).append(this.parameters[i].getPresentation())
        $(paramList).append(paramItem);
    }
    $(result).append(paramList);
    return result;
}

GameCreator.ActionItemVM.prototype.getParameters = function() {
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