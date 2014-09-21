GameCreator.commonObjectViews = {
    addCommonObjectViews: function(object) {
        object.getEditWindow = GameCreator.commonObjectViews.getEditWindow;
        object.getCountersContent = GameCreator.commonObjectViews.getCountersContent;
        object.getCollisionsContent = GameCreator.commonObjectViews.getCollisionsContent;
        object.getCounterEventsContent = GameCreator.commonObjectViews.getCounterEventsContent;
        object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
        object.getStatePropertiesContent = GameCreator.commonObjectViews.getStatePropertiesContent;
        object.getNonStatePropertiesForm = GameCreator.commonObjectViews.getNonStatePropertiesForm;
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
        object.getEventsContent = GameCreator.commonObjectViews.getEventsContent;
        object.getAddGlobalObjectPropertiesContent = GameCreator.commonObjectViews.getAddGlobalObjectPropertiesContent;
    },

    addPlayerObjectViews: function(object) {
        GameCreator.commonObjectViews.addCommonObjectViews(object);
        object.getKeySelector = GameCreator.commonObjectViews.getKeySelector;
        object.getKeysContent = GameCreator.commonObjectViews.getKeysContent;
    },

    addCounterObjectViews: function(object) {
        object.getPropertiesContent = GameCreator.commonObjectViews.getPropertiesContent;
        object.getStatesContent = GameCreator.commonObjectViews.getStatesContent;
        object.getAddGlobalObjectPropertiesContent = GameCreator.commonObjectViews.getAddGlobalObjectPropertiesContent;
    },

    /******************************
     * COMMON OBJECT VIEWS *
     ******************************/

    getEditWindow: function() {
        var result = "";

        result += '<div class="dialogue bottom"> \
                   <!-- Panel: Object manager --> \
                   <div id="object-manager" class="panel panel-dialogue"> \
                   <div class="panel-heading "> \
                   <span class="panel-title">Object manager</span> \
                   </div> \
                   <div id="object-manager-library" class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">Library</span> \
                   </div> \
                   <div id="object-manager-library-preview" class="library-preview panel-paragraph"></div> \
                   <div id="object-manager-library-explorer" class="library-explorer"> \
                   <ul class="global-object-list"> \
                   </ul> \
                   </div> \
                   </div> \
                   <div class="col border-right"> \
                   <div class="panel-heading"> \
                   <span class="panel-title">Edit</span> \
                   </div> \
                   <ul id="dialogue-panel-edit" class="nav nav-stacked nav-tabs nav-tabs-success"> \
                   <li data-uifunction="setupPropertiesForm"><i class="icon-codeopen" /><span>Properties</span></li> \
                   <li data-uifunction="setupStatesColumn"><i class="icon-codeopen" /><span>States</span></li> \
                   <li data-uifunction="setupEventsForm"><i class="icon-codeopen" /><span>Events</span></li> \
                   <li data-uifunction="setupCountersForm"><i class="icon-codeopen" /><span>Counters</span></li> \
                   </ul> \
                   </div> \
                   <div id="dialogue-edit-content" class="content"> \
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
        result += '<button id="add-new-counter-event-button" class="icon-plus btn btn-success">Add</button>';
        return result;
    },

    getCollisionsContent: function(collisionObjects) {
        var result = '<div id="edit-collision-actions-object-menu-container"><div id="edit-collision-actions-object-menu">';
        result += '<button id="add-new-collision-button" class="icon-plus btn btn-success">Add whatever?</button>';

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
            result += GameCreator.htmlStrings.defaultMenuElement(keys[i]);
        }
        return result;
    },

    getStatesContent: function() {
        var i, result = '';
        for (i = 0; i < this.states.length; i++) {
            if(this.states[i].name !== "Default") {
                result += GameCreator.htmlStrings.stateMenuElement(this.states[i].id, this.states[i].name);
            }
        }
        return result;
    },

    getStatePropertiesContent: function(title) {
        var result = '\
        <div class="col border-right object-manager-properties"> \
            <div class="panel-heading"> \
                <span class="panel-title">' + title + '</span> \
            </div> \
            <div class="panel-body"> \
                <div class="panel-paragraph"> \
                    <div id="state-properties-content">';
                        result += this.getPropertiesForm() +
                    '</div>\
                </div>\
            </div>\
        </div>';
        return result;
    },

    getAddGlobalObjectPropertiesContent: function(title) {
        var result = '\
        <div class="col border-right object-manager-properties"> \
            <div class="panel-heading"> \
                <span class="panel-title">' + title + '</span> \
            </div> \
            <div class="panel-body"> \
                <div class="panel-paragraph"> \
                    <div id="state-properties-content"> \
                    <div class="form-group"> \
                        <div id="object-property-name-container" class="form-item"> \
                            <label>Name</label> \
                            <input type="text" id="add-global-object-name-input" placeholder="Object name"/> \
                        </div> \
                    </div>';
                        result += this.getPropertiesForm() +
                        '<button id="save-new-global-object-button">Save object</button>\
                    </div>\
                </div>\
            </div>\
        </div>';
        return result;
    },

    getPropertiesContent: function() {
        var result = "";
            
            result += '<div class="col border-right object-manager-properties"> \
                       <div class="panel-heading"> \
                       <span class="panel-title">Properties</span> \
                       </div> \
                       <div class="panel-body"> \
                       <div class="panel-paragraph"> \
                       <div id="object-properties-content">'

            result += this.getPropertiesForm();

            result += '</div> \
                       <div id="object-non-state-properties-content">'

            result += this.getNonStatePropertiesForm();

            result += '</div> \
                       </div> \
                       </div> \
                       </div> \
                       </div>';
                       
        return result;
    },

    getNonStatePropertiesForm: function() {
        var result = "";
            result += '<div class="form-group"> \
                        <div id="object-property-unique-container" class="form-item"> \
                        </div> \
                       </div>';

        return result;
    },

    getEventsContent: function() {
        var result = "";
            result += '<div class="col border-right"> \
                       <div class="panel-heading"> \
                       <span class="panel-title">Events</span> \
                       </div> \
                       <ul id="dialogue-panel-events" class="nav nav-stacked nav-tabs nav-tabs-success"> \
                       <li data-uifunction="setupOnCreateActionsForm"><i class="icon-codeopen" /><span>On Create</span></li> \
                       <li data-uifunction="setupCollisionsForm"><i class="icon-codeopen" /><span>On Collide</span></li> \
                       <li data-uifunction="setupOnDestroyActionsForm"><i class="icon-codeopen" /><span>On Destroy</span></li>';
            
            result += this.getEvents();

            result += '</ul> \
                       </div> \
                       <div id="dialogue-events-content" class="content"> \
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
                result += GameCreator.htmlStrings.defaultMenuElement(keyName);
            }
        }
        result += '<li><button id="add-new-key-button" class="regularButton">Add</div></li>';
        return result;
    },
}