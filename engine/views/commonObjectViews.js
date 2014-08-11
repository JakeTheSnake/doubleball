GameCreator.commonObjectViews = {
    addCommonObjectViews: function(object) {
        object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
        object.getCountersContent = GameCreator.commonObjectViews.getCountersContent;
        object.getCollisionsContent = GameCreator.commonObjectViews.getCollisionsContent;
        object.getCounterEventsContent = GameCreator.commonObjectViews.getCounterEventsContent;
        object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
        object.getNonStatePropertiesForm = GameCreator.commonObjectViews.getNonStatePropertiesForm;
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
        object.getPropertiesForm = GameCreator.commonObjectViews.getPropertiesForm;
        object.getEventsContent = GameCreator.commonObjectViews.getEventsContent;
    },

    addPlayerObjectViews: function(object) {
        GameCreator.commonObjectViews.addCommonObjectViews(object);
        object.getKeySelector = GameCreator.commonObjectViews.getKeySelector;
        object.getKeysContent = GameCreator.commonObjectViews.getKeysContent;
    },

    addCounterObjectViews: function(object) {
        object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
        object.getPropertiesForm = GameCreator.commonObjectViews.getPropertiesForm;
    },

    /******************************
     * COMMON OBJECT VIEWS *
     ******************************/

    getEditWindow: function() {
        var result = "";

        result += '<div class="dialogue bottom"> \
                   <!-- Panel: Object manager --> \
                   <div id="object-manager" class="panel panel-default"> \
                   <div class="panel-heading "> \
                   <span class="panel-title">Object manager</span> \
                   </div> \
                   <div id="dialogue-library" class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">Library</span> \
                   </div> \
                   <div id="dialogue-library-preview" class="library-preview panel-paragraph"></div> \
                   <div id="dialogue-library-explorer" class="library-explorer"> \
                   <ul class="global-object-list"> \
                   </ul> \
                   </div> \
                   </div> \
                   <div class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">Edit</span> \
                   </div> \
                   <ul id="dialogue-panel-edit" class="nav nav-tabs nav-stacked"> \
                   <li data-uifunction="setupPropertiesForm">Properties</li> \
                   <li data-uifunction="setupStatesForm">States</li> \
                   <li data-uifunction="setupEventsForm">Events</li> \
                   <li data-uifunction="setupCountersForm">Counters</li> \
                   </ul> \
                   </div> \
                   <div id="dialogue-edit-content"> \
                   </div> \
                   </div> \
                   </div> \
                   </div> \
                   </div>';

                   
        return result;
    },

    getCounterEventsContent: function(counterName){
        var counter = this.parentCounters[counterName];
        var value;
        var result = GameCreator.htmlStrings.counterEventMenuElement("", "onIncrease");
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
        result += '<li><button id="add-new-counter-event-button" class="regularButton">Add</button></li>';
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
        var result = '';
        var keys = Object.keys(this.parentCounters);
        for (var i = 0; i < keys.length; i++) {
            result += GameCreator.htmlStrings.counterMenuElement(keys[i]);
        }
        result += '<li><button id="add-new-counter-button" class="regularButton">Add</button></li>';
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
        result += this.getPropertiesForm(0);
        result += '</div>'
        return result;
    },

    getPropertiesContent: function(stateId) {
        var result = "";
            
            result += '<div id="dialogue-properties" class="col border-right"> \
                       <div class="panel-heading"> \
                       <span class="panel-title">Properties</span> \
                       </div> \
                       <div class="panel-body"> \
                       <div class="panel-paragraph"> \
                       <div id="object-properties-content">'

            result += this.getPropertiesForm(0);

            result += '</div> \
                       <div id="object-non-state-properties-content">'

            result += this.getNonStatePropertiesForm();

            result += '</div> \
                       </div> \
                       <div class="panel-paragraph"> \
                       <h2>Set default graphic</h2> \
                       <div class="form-group"> \
                       <div class="form-item"> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="http://"> \
                       </div> \
                       </div> \
                       </div> \
                       </div> \
                       </div> \
                       </div>';
                       
        return result;
    },

    getPropertiesForm: function(stateId) {
        var state = this.getState(stateId);
        var result = "";
            result += '<div class="form-group"> \
                       <div class="form-item"> \
                       <label for="object-property-image">Image 1</label> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="500"> \
                       </div> \
                       </div> \
                       <div class="form-group"> \
                       <div class="form-item"> \
                       <label for="object-property-image">Image 3</label> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="500"> \
                       </div> \
                       <div class="form-item"> \
                       <label for="object-property-image">Image 4</label> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="500"> \
                       </div> \
                       </div>';


        /*
          GameCreator.helpers.getAttributeForm(state.attributes, GameCreator[this.objectType].objectAttributes, state.attributes);
        */

        return result;
    },

    getNonStatePropertiesForm: function() {
        var result = "";
            result += '<div class="form-group"> \
                       <div class="form-item"> \
                       <label for="object-property-image">Image 5</label> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="500"> \
                       </div> \
                       <div class="form-item"> \
                       <label for="object-property-image">Image 6</label> \
                       <input id="object-property-width" type="text" data-type="range" data-attrname="width" value="500"> \
                       </div> \
                       </div>';

        return result;


        /*
          GameCreator.htmlStrings.inputLabel('global-object-unique', 'Unique:') +
          GameCreator.htmlStrings.checkboxInput('global-object-unique', 'unique', this.unique)
        */
    },

    getEventsContent: function() {
        var result = "";
            result += '<div class="col border-right"> \
                       <div class="panel-heading"> \
                       <span class="panel-title">Events</span> \
                       </div> \
                       <ul id="dialogue-panel-events" class="nav nav-tabs nav-stacked"> \
                       <li data-uifunction="setupOnCreateActionsForm">On Create</li> \
                       <li data-uifunction="setupCollisionsForm">On Collide</li> \
                       <li data-uifunction="setupOnDestroyActionsForm">On Destroy</li>';
            
            result += this.getEvents();

            result += '</ul> \
                       </div> \
                       <div id="dialogue-events-content"> \
                       </div>';
        return result;
    },
    
    /******************************
     * COMMON PLAYER OBJECT VIEWS *
     ******************************/
    

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

    getKeysContent: function() {
        var result = '';
        for (var keyName in this.keyEvents) {
            if (this.keyEvents[keyName].length > 0) {
                result += GameCreator.htmlStrings.keyMenuElement(keyName);
            }
        }
        result += '<li><div id="add-new-key-button" class="regularButton">Add</div></li>';
        return result;
    },
}