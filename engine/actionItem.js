// Number
// Random number
// Scene Object
// Counter
// Timing

GameCreator.SceneObjectParameter = function(name, actionItem, mandatory, defaultValue) {
    this.name = name;
    this.actionItem = actionItem;
    this.mandatory = mandatory;
    this.value = defaultValue;
};

GameCreator.NumberParameter = function(name, actionItem, mandatory, defaultValue) {
    this.name = name;
    this.actionItem = actionItem;
    this.mandatory = mandatory;
    this.value = defaultValue;
};

GameCreator.NumberParameter.prototype.getPresentation = function() {
    // Create and return the presentaiton this parameter should have in the list.
    var result = '<div class="parameterBox">' + this.value + '</div>';
};

GameCreator.NumberParameter.prototype.getInput = function() {
    var result = "<div>" + GameCreator.htmlStrings.rangeInput(this.name + "-input", this.name, this.defaultValue) + "</div>";
    return result;
};

GameCreator.NumberParameter.prototype.attachListener = function(callback) {
    var param = this;
    $("#" + this.name + "-input").blur(function() {
        param.value = GameCreator.helper.getValue(this);
        callback();
    });
}

GameCreator.ActionItem = function(runtimeAction, actionId) {
    this.actionId = actionId; // Unique ID for this action's box in the dom.
    this.runtimeAction = runtimeAction; // Pointer to the saved action in the event 
    this.parameters = this.getParameterList();
};

/**
 * Returns the list of addable actions/parmeters for this action item.
 *
 * The list will include the parameters not currently used.
 */
GameCreator.ActionItem.prototype.getActionList = function() {
    var actionList = [];
    var existingParams = this.runtimeAction.parameters; 
    var allParams = GameCreator.actions[this.runtimeAction.name].params;

    for (var i = 0; i < Object.keys(allParams).length; i++) {
        var param = Object.keys(allParams)[i];
        if (!existingParams.some(function(item) { return item.name == param.name; })) {
            actionList.append(param.name);
        }
    }
    return actionList;
};

GameCreator.ActionItem.prototype.getParameterList = function() {
    var actionItem = this;
    return Object.keys(this.runtimeAction.parameters).collect(function(item) {
       var templateActionParams = GameCreator.actions[actionItem.runtimeAction.name].params[item];
       return new templateActionParams.param(item, actionItem, templateActionParams.mandatory, actionItem.runtimeAction.value);
    });
}

GameCreator.ActionItem.prototype.getParameter = function(name) {
    var i;
    for (i = 0; i < this.parameters.length; i++) {
        if (this.parameters[i].name == name) {
            return this.parameters[i];
        }
    }
    return null;
}

GameCreator.ActionItem.prototype.appendParameter = function(name) {
    var paramObject = GameCreator.actions[this.runtimeAction.name].params[name];
    var parameter = new paramObject.param(name, this, paramObject.mandatory, paramObject.defaultValue);
    this.parameters.append(parameter);
}

GameCreator.ActionItem.prototype.removeParameter = function(name) {
    delete this.runtimeAction.params[name];
    this.updateParameters();
}

GameCreator.ActionItem.prototype.updateParameters = function() {
    var i;
    this.parameters = this.getParameterList();
    for (i = 0; i < this.parameters.length; i++) {
        $(this.actionId).append(this.parameters[i].getPresentation());
        this.parameters[i].attachListener(this.updateParameters);
    }
}




