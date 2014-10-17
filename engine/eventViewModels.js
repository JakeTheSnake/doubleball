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
        
        conditionsList = document.createElement('div');
        conditionsList.className = 'conditions-group';

        this.appendActiveTitle(conditionsList);
        this.appendConditions(conditionsList);    
        this.appendAddConditionButton(conditionsList);
        
        $(listItem).append(conditionsList);
    } else {
        this.appendInactiveTitle(listItem);
        
        $(listItem).on('click', function() {
            $("#dialogue-panel-actions").trigger('redrawList', this);
            $("#dialogue-panel-conditions").trigger('redrawList', this);
        }.bind(this));
    }

    return listItem;
}

GameCreator.CASetVM.prototype.appendAddConditionButton = function(conditionsList) {
    var addConditionButton = document.createElement('button');
    $(addConditionButton).addClass('icon-plus btn btn-success');
    $(addConditionButton).html('Add condition');

    $(addConditionButton).on('click', function() {
        GameCreator.UI.populateSelectConditionList(this);
    }.bind(this));
    $(conditionsList).append(addConditionButton);
}

GameCreator.CASetVM.prototype.appendConditions = function(conditionsList) {
    var i;

    if (this.conditionVMs.length == 0) {
        $(conditionsList).append('<div class="condition-parameters"><span>Always</span></div>');
    } else {
        for (i = 0; i < this.conditionVMs.length; i+=1) {
            $(conditionsList).append(this.conditionVMs[i].getPresentation());
        }
    }
}

GameCreator.CASetVM.prototype.appendInactiveTitle = function(caSetList) {
    var title = this.createTitle();

    $(title).addClass('icon-right-open');

    $(caSetList).append(title);
}

GameCreator.CASetVM.prototype.appendActiveTitle = function(conditionsList) {
    var title = this.createTitle();
    
    $(title).addClass('icon-down-open');

    $(title).on('click', function(){
        $("#dialogue-panel-conditions").trigger('redrawList', null);
        $("#dialogue-panel-actions").empty();
    });
    $(conditionsList).append(title);
}

GameCreator.CASetVM.prototype.createTitle = function() {
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

    return title;
}


GameCreator.ConditionItemVM = function(model, globalObj) {
    this.model = model; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
    this.globalObj = globalObj;
    this.template = GameCreator.conditions[this.model.name];
};

GameCreator.ConditionItemVM.prototype.getPresentation = function() {
    var result = document.createElement('div');
        result.className = 'condition-parameters';
    var title = document.createElement('span');
    $(title).addClass('icon-down-dir');
    $(title).append(this.model.name);
    $(result).append(title);

    var paramList = document.createElement('table');
    for (var i = 0; i < this.parameters.length; i+=1) {
        var paramItemRow = document.createElement('tr');
        $(paramItemRow).append(this.parameters[i].getLabel());
        var paramValuePresenter = this.parameters[i].element;
        $(paramItemRow).append(paramValuePresenter);
        var observerParam = GameCreator.conditions[this.model.name].params[this.parameters[i].name].observer;
        GameCreator.UI.setupValuePresenter(paramValuePresenter, this.model.parameters, 
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


GameCreator.ActionItemVM.prototype.getPresentation = function() {
    var result = document.createElement('li');
        result.className = 'condition-parameters';
    var title = document.createElement('span');
    $(title).addClass('icon-down-dir');
    var actionItemVM = this;
    
    $(title).append(this.model.name);

    $(result).append(title);

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
        GameCreator.UI.setupValuePresenter(paramValuePresenter, this.model.parameters, 
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
            return new currentParam.param(caSetItemVM, paramName, currentParam.mandatory);
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
