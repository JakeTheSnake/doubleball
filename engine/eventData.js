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

GameCreator.NumberParameter = function(name, eventDataItem, mandatory, defaultValue) {
    this.name = name;
    this.eventDataItem = eventDataItem;
    this.mandatory = mandatory;
    this.value = defaultValue;
};

GameCreator.NumberParameter.prototype.getPresentation = function() {
    var result = "<div>" + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.defaultValue) + "</div>";
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

GameCreator.EventDataItem = function(databaseObject) {
    this.databaseObject = databaseObject; // Pointer to the saved action in the event 
    this.parameters = this.getSelectedParameters();
    this.redrawSelectedParameters();

    // Todo: Here we need to add an on click listener which selects this
    // eventDataItem in the UI and enables the user to add parameters to it.
};

/**
 * Returns the list of addable parmeters for this action item.
 *
 * The list will include the parameters not currently used.
 */
GameCreator.EventDataItem.prototype.getAvailableParameters = function() {
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
                new currentParam(param, this, mandatory, defaultValue)
            );
        }
    }

    return result;
};

GameCreator.EventDataItem.prototype.getSelectedParameters = function() {
    var eventDataItem = this;
    var allParams = this.databaseObject.getAllParameters();
    return Object.keys(this.databaseObject.parameters).collect(function(item) {
       var currentParam = eventDataItem.databaseObject.getParameter(item);
       return new currentParam(item, eventDataItem, currentParam.mandatory, eventDataItem.databaseObject.parameters[item]);
    });
}

GameCreator.EventDataItem.prototype.getParameter = function(name) {
    var i;
    for (i = 0; i < this.parameters.length; i++) {
        if (this.parameters[i].name == name) {
            return this.parameters[i];
        }
    }
    return null;
}

GameCreator.EventDataItem.prototype.appendParameter = function(name) {
    var paramObject = GameCreator.actions[this.runtimeAction.name].params[name];
    var parameter = new paramObject.param(name, this, paramObject.mandatory, paramObject.defaultValue);
    this.parameters.append(parameter);
}

GameCreator.EventDataItem.prototype.removeParameter = function(name) {
    delete this.runtimeAction.params[name];
    this.redrawSelectedParameters();
}

GameCreator.EventDataItem.prototype.redrawSelectedParameters = function() {
    var i;
    this.parameters = this.getSelectedParameters();
    for (i = 0; i < this.parameters.length; i++) {
        // TODO: Here we should add the presentation for all parameters
        // to the container under its action in the UI.
        //$(this.actionId).append(this.parameters[i].getPresentation());
    }
}




