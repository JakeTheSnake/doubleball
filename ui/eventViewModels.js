GameCreator.CASetVM = function(caSet, selectableActions, globalObj) {
    var i;
    this.caSet = caSet;
    this.actionVMs = [];
    this.conditionVMs = [];
    this.selectableActions = selectableActions;
    this.globalObj = globalObj;
    for (i = 0; i < this.caSet.actions.length; i++) {
        this.actionVMs.push(new GameCreator.ActionItemVM(this.caSet.actions[i], globalObj));
    }

    for (i = 0; i < this.caSet.conditions.length; i++) {
        this.conditionVMs.push(new GameCreator.ConditionItemVM(this.caSet.conditions[i], globalObj));
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
    this.conditionVMs.push(new GameCreator.ConditionItemVM(runtimeCondition, this.globalObj));
};

GameCreator.CASetVM.prototype.addAction = function(actionName) {
    var j, runtimeAction, parameterName, parameters = {};
    for(j = 0; j < Object.keys(GameCreator.actions[actionName].params).length; j += 1) {
        parameterName = Object.keys(GameCreator.actions[actionName].params)[j];
        parameters[parameterName] = GameCreator.actions[actionName].params[parameterName].defaultValue;
    }
    runtimeAction = new GameCreator.RuntimeAction(actionName, parameters);
    this.caSet.actions.push(runtimeAction);
    this.actionVMs.push(new GameCreator.ActionItemVM(runtimeAction, this.globalObj));
}

GameCreator.CASetVM.prototype.getPresentation = function(active) {
    var conditionsList;
    var listItem = document.createElement('li');

    if (active) {
        $(listItem).addClass('active');

        this.appendTitle(listItem);
        this.appendConditions(listItem);    
        this.appendAddConditionButton(listItem);
        
    } else {
        this.appendTitle(listItem);
        
        $(listItem).on('click', function() {
            $("#dialogue-panel-actions").trigger('redrawList', this);
            $("#dialogue-panel-conditions").trigger('redrawList', this);
        }.bind(this));
    }

    return listItem;
}

GameCreator.CASetVM.prototype.appendAddConditionButton = function(conditionsList) {
    var addConditionButton = document.createElement('a');
    $(addConditionButton).addClass('btn edit wide');
    $(addConditionButton).html('Add condition');

    $(addConditionButton).on('click', function() {
        GameCreator.UI.populateSelectConditionList(this);
    }.bind(this));
    $(conditionsList).append(addConditionButton);
}

GameCreator.CASetVM.prototype.appendConditions = function(conditionsList) {
    var i;

    if (this.conditionVMs.length == 0) {
        $(conditionsList).append('<div class="parameter-group"><div class="parameter-group-title"><span>Always</span></div></div>');
    } else {
        for (i = 0; i < this.conditionVMs.length; i+=1) {
            $(conditionsList).append(this.conditionVMs[i].getPresentation(this));
        }
    }
}

GameCreator.CASetVM.prototype.appendTitle = function(caSetList) {
    var names = [];
    var title = document.createElement('span');
    
    if (this.conditionVMs.length == 0) {
        $(title).append('Always');
    } else {
        for (i = 0; i < this.conditionVMs.length; i+=1) {
            names.push(this.conditionVMs[i].model.name);
        }
        $(title).append(names.join(' & '));
    }

    $(caSetList).append(title);
}


GameCreator.ConditionItemVM = function(model, globalObj) {
    this.model = model; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
    this.globalObj = globalObj;
    this.template = GameCreator.conditions[this.model.name];
};

GameCreator.ConditionItemVM.prototype.getPresentation = function(CASetVM) {
    var result = document.createElement('div');
        result.className = 'parameter-group';
    var title = document.createElement('div');
    $(title).addClass('parameter-group-title');
    var titleSpan = document.createElement('span');
    var conditionItemVM = this;
    $(titleSpan).append(this.model.name);
    $(title).append(titleSpan);


    var deleteButton = GameCreator.UI.deleteButtonElement();

    $(title).append(deleteButton);

    $(result).append(title);

    $(deleteButton).on('click', function(){
        //Remove conditions from model and from viewmodel.
        var conditionsArray = CASetVM.caSet.conditions;
        var index = conditionsArray.indexOf(conditionItemVM.model);
        if (index !== -1) {
            conditionsArray.splice(index, 1);
        }
        conditionsArray = CASetVM.conditionVMs;
        index = conditionsArray.indexOf(conditionItemVM);
        if (index !== -1) {
            conditionsArray.splice(index, 1);
        }
        $("#dialogue-panel-conditions").trigger('redrawList', CASetVM);
    });

    var paramList = document.createElement('table');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItemRow = document.createElement('tr');
        $(paramItemRow).append(this.parameters[i].getLabel());
        var paramValuePresenter = this.parameters[i].element;
        $(paramItemRow).append(paramValuePresenter);
        var observerParam = GameCreator.conditions[this.model.name].params[this.parameters[i].name].observer;
        this.parameters[i].setupValuePresenter(paramValuePresenter, this.model.parameters, 
            this.parameters[i].name, this.globalObj,
            this.updateParameter.bind(this, observerParam));
        $(paramList).append(paramItemRow);
    }
    $(result).append(paramList);

    return result;
}

GameCreator.ConditionItemVM.prototype.getSelectedParameters = function() {
    var caSetItemVM = this;
    return Object.keys(this.model.parameters).collect(function(paramName) {
       var currentParam = caSetItemVM.model.getParameter(paramName);
       return new currentParam.param(caSetItemVM, paramName, currentParam.mandatory);
    });
}

GameCreator.ConditionItemVM.prototype.updateParameter = function(paramName, value) {
    for (var i = 0; i < this.parameters.length; i += 1) {
        if (this.parameters[i].name === paramName) {
            this.parameters[i].update(value);
        }
    }
}

GameCreator.ActionItemVM = function(model, globalObj) {
    this.model = model; // Pointer to the saved action in the event 
    this.parameters = this.getParameters();
    this.globalObj = globalObj;
    this.template = GameCreator.actions[this.model.name];
};


GameCreator.ActionItemVM.prototype.getPresentation = function(CASetVM) {
    var result = document.createElement('li');
        result.className = 'parameter-group';
    var title = document.createElement('div');
    var titleSpan = document.createElement('span');
    $(title).addClass('parameter-group-title');
    $(title).append(titleSpan);

    $(titleSpan).append(this.model.name);
    var actionItemVM = this;
    
    $(result).append(title);

    var deleteButton = GameCreator.UI.deleteButtonElement();

    $(title).append(deleteButton);

    $(deleteButton).on('click', function(){
        //Remove action from model and from viewmodel.
        var actionsArray = CASetVM.caSet.actions;
        var index = actionsArray.indexOf(actionItemVM.model);
        if (index !== -1) {
            actionsArray.splice(index, 1);
        }
        actionsArray = CASetVM.actionVMs;
        index = actionsArray.indexOf(actionItemVM);
        if (index !== -1) {
            actionsArray.splice(index, 1);
        }
        $("#dialogue-panel-actions").trigger('redrawList', CASetVM);
    });

    var paramList = document.createElement('table');
    this.addParameterPresentations(paramList);

    var timingItem = $(document.createElement('tr'));
    var timingParam = new GameCreator.TimingParameter(this.model);
    timingParam.setupValuePresenter(timingItem);
    $(paramList).append(timingItem);
    $(result).append(paramList);

    return result;
}

GameCreator.ActionItemVM.prototype.addParameterPresentations = function(container) {
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItem = document.createElement('tr');
        $(paramItem).append(this.parameters[i].getLabel());

        var paramValuePresenter = this.parameters[i].element;
        $(paramItem).append(paramValuePresenter);
        
        var observerParam = GameCreator.actions[this.model.name].params[this.parameters[i].name].observer;
        this.parameters[i].setupValuePresenter(paramValuePresenter, this.model.parameters, 
            this.parameters[i].name, this.globalObj,
            this.updateParameter.bind(this, observerParam));
        $(container).append(paramItem);
    }
};

GameCreator.ActionItemVM.prototype.getParameters = function() {
    var caSetItemVM = this;
    return Object.keys(this.model.parameters).collect(function(paramName) {
        var currentParam = caSetItemVM.model.getParameter(paramName);
        if (currentParam) {
            return new currentParam.param(caSetItemVM, paramName, currentParam.mandatory, caSetItemVM.model);
        }
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

GameCreator.ActionItemVM.prototype.updateParameter =  function(paramName, value) {
    for (var i = 0; i < this.parameters.length; i += 1) {
        if (this.parameters[i].name === paramName) {
            this.parameters[i].update(value);
        }
    }
}
