GameCreator.commonObjectViews = {
    addCommonObjectViews: function(object) {
        object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
        object.getCountersContent = GameCreator.commonObjectViews.getCountersContent;
        object.getCollisionsContent = GameCreator.commonObjectViews.getCollisionsContent;
        object.getCounterEventsContent = GameCreator.commonObjectViews.getCounterEventsContent;
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
        object.getNonStatePropertiesForm = GameCreator.commonObjectViews.getNonStatePropertiesForm;
    },

    addPlayerObjectViews: function(object) {
        GameCreator.commonObjectViews.addCommonObjectViews(object);
        object.getKeySelector = GameCreator.commonObjectViews.getKeySelector;
        object.getPropertiesForm = GameCreator.commonObjectViews.getPropertiesForm;
        object.getKeyEventsContent = GameCreator.commonObjectViews.getKeyEventsContent;
        object.getKeySelector = GameCreator.commonObjectViews.getKeySelector;
    },

    addCounterObjectViews: function(object) {
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
    },

    /******************************
     * COMMON OBJECT VIEWS *
     ******************************/

    getEditWindow: function() {
        var result = "";

        result += '<div id="dialogue-window-title">Edit object</div> \
                   <div id="dialogue-window-menu"> \
                   <a class="tab dialogue-window-tab active" data-uifunction="setupPropertiesForm">Properties</a>';

        result += this.getTabs();

        result += '<a class="tab dialogue-window-tab" data-uifunction="setupOnDestroyActionsForm">On destroy</a> \
                   <a class="tab dialogue-window-tab" data-uifunction="setupOnCreateActionsForm">On create</a> \
                   <a class="tab dialogue-window-tab" data-uifunction="setupStatesForm">States</a> \
                   </div> \
                   <div id="edit-global-object-window-content"></div>';

        return result;
    },

    getCounterEventsContent: function(counterName){
        var counter = this.parentCounters[counterName];
        var value;
        var result = '<button id="add-new-counter-event-button" class="regularButton">Add</button>';
        result += GameCreator.htmlStrings.counterEventMenuElement("", "onIncrease");
        result += GameCreator.htmlStrings.counterEventMenuElement("", "onDecrease");
        for (value in counter.atValue) {
            if (counter.atValue.hasOwnProperty(value)){
                result += GameCreator.htmlStrings.counterEventMenuElement(value, "atValue");
            }
        };
        for (value in counter.aboveValue) {
            if (counter.aboveValue.hasOwnProperty(value)){
                result += GameCreator.htmlStrings.counterEventMenuElement(value, "aboveValue");
            }
        };
        for (value in counter.belowValue) {
            if (counter.belowValue.hasOwnProperty(value)){
                result += GameCreator.htmlStrings.counterEventMenuElement(value, "belowValue");
            }
        };
        return result;
    },

    getCollisionsContent: function(collisionObjects) {
        var result = '<div id="edit-collision-actions-object-menu-container"><div id="edit-collision-actions-object-menu">';
        result += '<button id="add-new-collision-button" class="regularButton">Add</button>';

        for(var i = 0; i < collisionObjects.length; i++) {
            result += GameCreator.htmlStrings.collisionMenuElement(collisionObjects[i]);
        }
        
        result += '</div> \
                   </div><div id="edit-collision-actions-object-content"></div>';
        return result;
    },

    getCountersContent: function() {
        var result = '<div id="edit-counters-menu">';
        result += '<button id="add-new-counter-button" class="regularButton">Add</button>';
        var keys = Object.keys(this.parentCounters);
        for (var i = 0; i < keys.length; i++) {
            result += GameCreator.htmlStrings.counterMenuElement(keys[i]);
        }
        result += '</div><div id="edit-counters-counter-content">'
        result += '<div id="edit-counter-event-content"></div>';
        result += '<div id="edit-counter-event-actions-content"></div></div>';
        return result;
    },

    getStatesContent: function(states) {
        var result = '<h>Edit states</h>';
        result += '<div id="state-tabs">';
        for(i = 0; i < states.length; i += 1) {
            result += '<div class="tab state-tab" data-state=' + i + '>' + states[i].name + '</div>';
        }
        result += '<div id="add-state-tab" class="tab state-tab">+</div>'
        result += '</div><br style="clear:both;"/>';
        result += '<div id="state-content">';
        result += this.getStateForm(0);
        result += '</div>'
        return result;
    },

    getNonStatePropertiesForm: function() {
        return '<div id="global-object-non-state-properties-content">' +
                GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique:') +
                GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique', this.unique) +
                '</div>';
    },
    
    /******************************
     * COMMON PLAYER OBJECT VIEWS *
     ******************************/
    getPropertiesForm: function(stateId) {
        var state = this.getState(stateId);
        var result = '<div id="global-object-properties-content">' 
        result += '<div>' +
                GameCreator.htmlStrings.inputLabel("player-object-width", "Width:") +
                GameCreator.htmlStrings.rangeInput("player-object-width", "width", state.width) +
                '<br style="clear:both;"/>' +
                GameCreator.htmlStrings.inputLabel("player-object-height", "Height:") +
                GameCreator.htmlStrings.rangeInput("player-object-height", "height", state.height) + '</div>' +
                '<br style="clear:both;"/>' +
                '<div style="height: 10px"></div>' +
                GameCreator[this.objectType].movementInputs(state) +
                GameCreator.htmlStrings.imageSrcInput(state) +
                '<br style="clear:both"/>' +
                '<button class="regularButton" id="save-global-object-properties-button">Save</button>' +
                '</div>';
        return result;
    },

    getKeySelector: function() {
        result = "";
        var selectableKeys = this.keyPressed;
        for (var keyName in selectableKeys) {
            if (selectableKeys.hasOwnProperty(keyName) && this.keyEvents[keyName].length === 0) {
                result += '<div class="addKeyObjectElement" data-keyName="' + keyName + '" style="float:left;cursor:pointer;"><span>' + keyName + '</span></div>';
            }
        }
        return result;
    },

    getKeyEventsContent: function() {
        var result = '<div id="edit-key-actions-object-menu-container"><div id="edit-key-actions-key-menu">';
        result += '<div id="add-new-key-button" class="regularButton">Add</div>';
        for (var keyName in this.keyEvents) {
            if (this.keyEvents[keyName].length > 0) {
                result += GameCreator.htmlStrings.keyMenuElement(keyName);
            }
        }
        result += '</div></div><div id="edit-key-actions-key-content"></div>';
        return result;
    },

}